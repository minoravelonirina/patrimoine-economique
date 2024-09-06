// backend/controllers/possessionController.js
// const fs = require('fs');
// const path = require('path');
// const dataPath = path.join(__dirname, '../data/possession.json');

// Helper functions
const readData = async () => {
//   const data = fs.readFileSync(dataPath);
//   return JSON.parse(data);
    const response = await fetch('/possession/data');
    const data = await response.json();
    const filteredData = data
    return filteredData;
};

const writeData = (data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

// Get all possessions
exports.getPossessions = (req, res) => {
  try {
    const possessions = readData();
    res.json(possessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new possession
exports.createPossession = (req, res) => {
  const { libelle, valeur, dateDebut, taux } = req.body;
  try {
    const possessions = readData();
    const newPossession = { libelle, valeur, dateDebut, taux, dateFin: null };
    possessions.push(newPossession);
    writeData(possessions);
    res.status(201).json(newPossession);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a possession
exports.updatePossession = (req, res) => {
  const { libelle } = req.params;
  const { dateFin } = req.body;
  try {
    let possessions = readData();
    possessions = possessions.map(possession =>
      possession.libelle === libelle ? { ...possession, dateFin } : possession
    );
    writeData(possessions);
    res.json(possessions.find(pos => pos.libelle === libelle));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Close a possession
exports.closePossession = (req, res) => {
  const { libelle } = req.params;
  try {
    let possessions = readData();
    possessions = possessions.map(possession =>
      possession.libelle === libelle ? { ...possession, dateFin: new Date().toISOString() } : possession
    );
    writeData(possessions);
    res.json(possessions.find(pos => pos.libelle === libelle));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
