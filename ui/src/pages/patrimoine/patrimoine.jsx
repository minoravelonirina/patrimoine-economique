import { useState, useEffect, useCallback } from "react";
import './patrimoine.css';
import Possession from "../../models/possessions/Possession";
import Flux from "../../models/possessions/Flux";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Patrimoine() {
  const [dateDebut, setDateDebut] = useState(new Date("2023-10-25").toISOString().split('T')[0]);
  const [dateFin, setDateFin] = useState(new Date().toISOString().split('T')[0]);
  const [jour, setJour] = useState("1");
  const [chartData, setChartData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [patrimoineValue, setPatrimoineValue] = useState(null);
  const [possessions, setPossessions] = useState([]);

  const fetchPossessions = useCallback(async () => {
    try {
      const response = await fetch('/possession');
      if (!response.ok) {
        throw new Error('Failed to fetch possessions');
      }
      const data = await response.json();
      const filteredData = data
        .filter(item => item.model === 'Patrimoine')
        .flatMap(item => item.data.possessions);
      
      const processedData = filteredData.map(item => {
        const isFlux = item.jour !== undefined;
        return {
          ...item,
          isFlux,
          valeur: isFlux ? item.valeurConstante : item.valeur,
        };
      });

      setPossessions(processedData);
    } catch (error) {
      console.error('Error fetching possessions:', error);
    }
  }, []);

  useEffect(() => {
    fetchPossessions();
  }, [fetchPossessions]);

  const calculateCurrentValue = (item, isFlux, date) => {
    if (isFlux) {
      const flux = new Flux(
        null,
        item.libelle,
        item.valeurConstante,
        new Date(item.dateDebut),
        item.dateFin ? new Date(item.dateFin) : null,
        item.tauxAmortissement,
        item.jour
      );
      return flux.getValeur(date);
    } else {
      const possession = new Possession(
        null,
        item.libelle,
        item.valeur,
        new Date(item.dateDebut),
        item.dateFin ? new Date(item.dateFin) : null,
        item.tauxAmortissement
      );
      return possession.getValeurApresAmortissement(possession.valeur, possession.tauxAmortissement, new Date(item.dateDebut), date);
    }
  };

  const calculatePatrimoine = (date) => {
    let totalValue = 0;
    possessions.forEach((item) => {
      const possessionStart = new Date(item.dateDebut);
      if (possessionStart <= date) {
        totalValue += calculateCurrentValue(item, item.isFlux, date);
      }
    });
    return totalValue;
  };

  const handleChartValidate = () => {
    const start = new Date(dateDebut);
    const end = new Date(dateFin);
    if (start && end) {
      const days = Math.ceil((end - start) / (1000 * 3600 * 24));
      const step = Math.max(1, Math.floor(days / parseInt(jour)));
      const dates = [];
      const values = [];

      for (let i = 0; i <= days; i += step) {
        const currentDate = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
        dates.push(currentDate.toISOString().split('T')[0]);
        values.push(calculatePatrimoine(currentDate));
      }

      setChartData({
        labels: dates,
        datasets: [
          {
            label: 'Valeur du patrimoine',
            data: values,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }
        ]
      });
    }
  };

  const handlePatrimoineValidate = () => {
    const date = new Date(selectedDate);
    if (date) {
      setPatrimoineValue(calculatePatrimoine(date));
    }
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Évolution du patrimoine',
      },
    },
    scales: {
      x: {
        type: 'category',
        title: {
          display: true,
          text: 'Date'
        }
      },
      y: {
        type: 'linear',
        title: {
          display: true,
          text: 'Valeur'
        }
      }
    }
  };

  return (
    <div className="container3">
      <div className="card mb-8">
        <div className="card-header">
          <h2 className="card-title">Évolution du patrimoine</h2>
        </div>
        <div className="card-content">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label htmlFor="dateDebut" className="label">Date de début</label>
              <input
                className="input"
                id="dateDebut"
                type="date"
                value={dateDebut}
                onChange={(e) => setDateDebut(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="dateFin" className="label">Date de fin</label>
              <input
                className="input"
                id="dateFin"
                type="date"
                value={dateFin}
                onChange={(e) => setDateFin(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="jour" className="label">Intervalle</label>
              <select id="jour" value={jour} onChange={(e) => setJour(e.target.value)} className="select-jour">
                <option value="1">Chaque jour</option>
                <option value="7">Chaque semaine</option>
                <option value="30">Chaque mois</option>
              </select>
            </div>
            <div>
              <button onClick={handleChartValidate} className="boutton-valide-chart">Valider</button>
            </div>
          </div>
          {chartData && <Line options={chartOptions} data={chartData} />}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Valeur du patrimoine à une date spécifique</h2>
        </div>
        <div className="card-content">
          <div className="content-label">
            <div className="div-label">
              <label htmlFor="selectedDate" className="label">Sélectionner une date</label>
              <input
                className="input"
                id="selectedDate"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <button onClick={handlePatrimoineValidate} className="valide-boutton">Valider</button>
          </div>
          {patrimoineValue !== null && (
            <p className="mt-4 text-lg font-semibold">
              Valeur du patrimoine : {Math.round(patrimoineValue)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
