import React, { useState } from 'react'
import './createPossession.css'
import { useNavigate } from 'react-router-dom'

export default function CreatePossession() {
  const navigate = useNavigate();

  const [possession, setPossession] = useState({
    libelle: '',
    valeur: '',
    dateDebut: new Date().toISOString().split('T')[0],
    tauxAmortissement: ''
  })

  const [errors, setErrors] = useState({
    libelle: '',
    valeur: '',
    dateDebut: '',
    tauxAmortissement: ''
  })

const handleChange = (e) => {
    const { name, value } = e.target;
    const getValue = (name, value) => {
        if (name === 'valeur' || name === 'tauxAmortissement') {
            return Number(value);
        } 
        return value;
    };
    setPossession(prev => ({ ...prev, [name]: getValue(name, value) }));
    setErrors(prev => ({ ...prev, [name]: '' }));
};


  const validateForm = () => {
    let isValid = true
    const newErrors = { libelle: '', valeur: '', dateDebut: '', tauxAmortissement: '' }

    if (!possession.libelle.trim()) {
      newErrors.libelle = 'Le libellé est requis'
      isValid = false
    }

    if (!possession.valeur) {
      newErrors.valeur = 'La valeur est requise'
      isValid = false
    } else if (isNaN(Number(possession.valeur))) {
      newErrors.valeur = 'La valeur doit être un nombre'
      isValid = false
    }

    if (!possession.dateDebut) {
      newErrors.dateDebut = 'La date de début est requise'
      isValid = false
    }

    if (!possession.tauxAmortissement) {
      newErrors.tauxAmortissement = 'Le taux est requis'
      isValid = false
    } else if (isNaN(Number(possession.tauxAmortissement))) {
      newErrors.tauxAmortissement = 'Le taux doit être un nombre'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (validateForm()) {
      alert("La possession a ete creee avec succes!")
      setPossession({ libelle: '', valeur: '', dateDebut: '', tauxAmortissement: '' })
        sendData(possession);
    }
    if (!validateForm()){
        alert("La creation d'une nouvelle possession a ete echoue.")
    }
  }

  const sendData = async (data) => {
    try {
      const response = await fetch('/possession', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to add data');
      }
  
      console.log('Success:', result.message);
      navigate("/possession") 
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container2">
      <h2 className="h2">Creer une nouvelle Possession</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className='libelle'>
          <label htmlFor="libelle" className="label">
            Libellé
          </label>
          <input
            type="text"
            id="libelle"
            name="libelle"
            value={possession.libelle}
            onChange={handleChange}
            className="input1"
            required
          />
          {errors.libelle && <p className="error">{errors.libelle}</p>}
        </div>

        <div className='valeur'>
          <label htmlFor="valeur" className="label">
            Valeur
          </label>
          <input
            type="number"
            id="valeur"
            name="valeur"
            value={possession.valeur}
            onChange={handleChange}
            className="input1"
            required
          />
          {errors.valeur && <p className="error">{errors.valeur}</p>}
        </div>

        <div className='dateDebut'>
          <label htmlFor="dateDebut" className="label">
            Date de début
          </label>
          <input
            type="date"
            id="dateDebut"
            name="dateDebut"
            value={possession.dateDebut}
            onChange={handleChange}
            className="input1"
            required
          />
          {errors.dateDebut && <p className="error">{errors.dateDebut}</p>}
        </div>

        <div className='taux'>
          <label htmlFor="taux" className="label">
            Taux
          </label>
          <input
            type="number"
            id="tauxAmortissement"
            name="tauxAmortissement"
            value={possession.tauxAmortissement}
            onChange={handleChange}
            className="input1"
            required
          />
          {errors.tauxAmortissement && <p className="error">{errors.tauxAmortissement}</p>}
        </div>

        <button type="submit" className="submit-button">Ajouter</button>
      </form>
    </div>
  )
}
