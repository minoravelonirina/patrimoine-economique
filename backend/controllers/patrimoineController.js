// backend/controllers/patrimoineController.js
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

// Get valeur patrimoine by date
exports.getValeurPatrimoine = (req, res) => {
  const { date } = req.params;
  try {
    const possessions = readData();
    const valeur = possessions
      .filter(pos => new Date(pos.dateDebut) <= new Date(date) && (!pos.dateFin || new Date(pos.dateFin) >= new Date(date)))
      .reduce((acc, pos) => acc + pos.valeur, 0);
    res.json({ valeur });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get valeur patrimoine range
exports.getValeurPatrimoineRange = (req, res) => {
  const { type, dateDebut, dateFin, jour } = req.body;
  try {
    const possessions = readData();
    const valeur = possessions
      .filter(pos => new Date(pos.dateDebut) >= new Date(dateDebut) && new Date(pos.dateFin) <= new Date(dateFin))
      .filter(pos => type === 'month' ? new Date(pos.dateDebut).getMonth() + 1 === jour : true)
      .reduce((acc, pos) => acc + pos.valeur, 0);
    res.json({ valeur });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
