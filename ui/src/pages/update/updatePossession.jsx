import React from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './update.css'

export default function UpdatePossession() {
  const [newLibelle, setNewLibelle] = useState('');
  const [newDateFin, setNewDateFin] = useState('');
  const navigate = useNavigate();
  const { libelle } = useParams()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/possession/${libelle}`);
        if (!response.ok) {
          const errorText = await response.text(); // Lire la réponse en texte
          throw new Error('');
        }
        const data = await response.json();
        setNewLibelle(data.libelle || '');
        setNewDateFin(data.dateFin || '');
      } catch (error) {
        console.error('Erreur:', error);
        alert(error.message);
      }
    };

    fetchData();
  }, [libelle]);

  const handleUpdate = async () => {
    try {
      const response = await fetch(`/possession/${libelle}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newLibelle, newDateFin }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Échec de la récupération des données');
      }

      const result = await response.json();
      alert(result.message);

      navigate('/possession');

    } catch (error) {
      console.error('Erreur:', error);
      alert(error.message);
    }
  };


  return (<>
    <div className='container1'>
      <h2 className='h2' style={{margin:"5vh"}}>Modifier une Possession</h2>
      <form className='form'>
      <div className='div'>
        <div className="div-input">
          <label htmlFor="text">Valeur de Libelle : </label>
          <input
            id='text'
            type="text"
            value={newLibelle}
            onChange={(e) => setNewLibelle(e.target.value)}
            placeholder="libelle"
          />
        </div>
        <div className="div-input">
          <label htmlFor="date">Valeur du date fin : </label>
          <input
            id='date'
            type="date"
            value={newDateFin}
            onChange={(e) => setNewDateFin(e.target.value)}
          />
        </div>
        </div>
      </form>
        <button onClick={handleUpdate} className='boutton'>Mettre à jour</button>
      </div>
  </>
  )
}
