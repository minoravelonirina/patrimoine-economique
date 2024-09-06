import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import cors from 'cors'

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use(express.static('../../ui/build'));


const dataFilePath = path.join(__dirname, 'data.json');

const readData = async () => {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erreur lors de la lecture des données:', error);
    throw error;
  }
};

const writeData = async (data) => {
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Erreur lors de l\'écriture des données:', error);
    throw error;
  }
};


// Request GET (get data):
app.get('/possession', async (_, res) => {
  try {
    const data = await readData();
    res.json(data);
  } catch (error) {
    res.status(500).send('Erreur serveur');
  }
});//-----------------------------------


// Request POST (add new possession in data):
app.post('/possession', async (req, res) => {
  const newPossession = req.body;

  try {
    const data = await readData();
    const possessions = data.flatMap(item =>
      item.model === 'Patrimoine' ? item.data.possessions : []
    );
    possessions.push({ ...newPossession });
    data.forEach(item => {
      if (item.model === 'Patrimoine') {
        item.data.possessions = possessions;
      }
    });
    await writeData(data);
    res.json({ message: 'Possession ajoutée avec succès' });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la possession:', error);
    res.status(500).send('Erreur interne du serveur');
  }
});//-------------------------------------


// Request PATCH (update date of possession to current date):
app.patch('/possession/:libelle/close', async (req, res) => {
  const { libelle } = req.params;
  const currentDate = new Date().toISOString().split('T')[0];
  try {
    const data = await readData();
    let updated = false;

    const updatedData = data.map(item => {
      if (item.model === 'Patrimoine') {
        item.data.possessions = item.data.possessions.map(possession => {
          if (possession.libelle === libelle) {
            updated = true;
            return { ...possession, dateFin: currentDate };
          }
          return possession;
        });
      }
      return item;
    });

    if (!updated) {
      return res.status(404).json({ error: 'Possession non trouvée' });
    }

    await writeData(updatedData);
    res.json({ message: 'Possession fermée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la fermeture de la possession:', error);
    res.status(500).send('Erreur interne du serveur');
  }
});//----------------------------------------


// Request PATCH (update libelle and final date of possession by libelle):
app.patch('/possession/:libelle', async (req, res) => {
  const { libelle } = req.params;
  const { newDateFin, newLibelle } = req.body;

  console.log('Libelle reçu:', libelle);
  console.log('Données reçues:', { newDateFin, newLibelle });

  if (!newDateFin || !newLibelle) {
    return res.status(400).json({ error: 'dateFin est requise' });
  }

  try {
    const data = await readData();
    let updated = false;

    const updatedData = data.map(item => {
      if (item.model === 'Patrimoine') {
        item.data.possessions = item.data.possessions.map(possession => {
          if (possession.libelle === libelle) {
            updated = true;
            return { ...possession, libelle: newLibelle, dateFin: newDateFin };
          }
          return possession;
        });
      }
      return item;
    });

    if (!updated) {
      return res.status(404).json({ error: 'Possession non trouvée' });
    }

    await writeData(updatedData);
    res.json({ message: 'Possession mise à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la possession:', error);
    res.status(500).send('Erreur interne du serveur');
  }
});//----------------------------------------------


// Request GET (get patrimoine):
app.get('/patrimoine', async (req, res) => {
  try {
    const data = await readData();
    res.json(data);
  } catch (error) {
    res.status(500).send('Erreur serveur');
  }
});//----------------------------------

app.use(cors({
  origin: 'https://patrimoine-ui-zn16.onrender.com',
}));


app.listen(PORT, () => {
  console.log(`Le serveur est lancé sur le port : ${PORT}.`);
});
