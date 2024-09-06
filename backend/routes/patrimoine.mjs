// backend/routes/patrimoine.js
const express = require('express');
const router = express.Router();
const patrimoineController = require('../controllers/patrimoineController');

router.get('/:date', patrimoineController.getValeurPatrimoine);
router.post('/range', patrimoineController.getValeurPatrimoineRange);

module.exports = router;
