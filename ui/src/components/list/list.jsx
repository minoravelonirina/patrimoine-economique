import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Possession from '../../models/possessions/Possession';
import Flux from '../../models/possessions/Flux';
import './list.css';

export default function List() {
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
          valeurActuelle: calculateCurrentValue(item, isFlux),
          actions: renderActions(item)
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

  const calculateCurrentValue = (item, isFlux) => {
    const currentDate = new Date();
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
      return flux.getValeur(currentDate);
    } else {
      const possession = new Possession(
        null, 
        item.libelle, 
        item.valeur, 
        new Date(item.dateDebut), 
        item.dateFin ? new Date(item.dateFin) : null, 
        item.tauxAmortissement
      );
      return possession.getValeurApresAmortissement(possession.valeur, possession.tauxAmortissement, new Date(possession.dateDebut), currentDate);
    }
  };

  const handleClose = async (libelle) => {
    try {
      const response = await fetch(`/possession/${libelle}/close`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
      });
      if (!response.ok) {
        throw new Error('Failed to close possession');
      }
      const result = await response.json();
      alert(result.message);
      fetchPossessions();
    } catch (error) {
      console.error('Error closing possession:', error);
    }
  };

  const renderActions = (item) => (
    <div className='actions'>
      <Link to={`/possession/${item.libelle}`}>
        <button className="modifier">Edit</button>
      </Link>
      <button 
        className="fermer" 
        onClick={() => handleClose(item.libelle)}>
        Close
      </button>
    </div>
  );


  const sommeValeursActuelles = useMemo(() => {
    return possessions.reduce((sum, possession) => sum + possession.valeurActuelle, 0);
  }, [possessions]);

  return (
    <div>
      <table className='bordered-table'>
        <thead>
          <tr style={{fontWeight:"bolder"}}>
            <th>LIBELLE</th>
            <th>VALEUR</th>
            <th>DATE DEBUT</th>
            <th>DATE FIN</th>
            <th>TAUX</th>
            <th>VALEUR ACTUELLE</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {possessions.map((possession, index) => (
            <tr key={index}>
              <td>{possession.libelle}</td>
              <td>{possession.valeur}</td>
              <td>{new Date(possession.dateDebut).toISOString().split('T')[0]}</td>
              <td>{possession.dateFin ? new Date(possession.dateFin).toISOString().split('T')[0] : "null"}</td>
              <td>{possession.tauxAmortissement ?? "0"}</td>
              <td>{Math.round(possession.valeurActuelle)}</td>
              <td>{possession.actions}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="somme-valeurs">
        <strong>La valeur du Patrimoine actuelle est : </strong>
        <span style={{color:"yellowgreen", fontWeight:"bold"}}>{  Math.round(sommeValeursActuelles)}</span>
      </div>
    </div>
  );
}