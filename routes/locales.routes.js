// routes/locales.routes.js
const express = require('express');
const router = express.Router();

const { obtenerLocalesCercanos } = require('../core/locales');

router.get('/', (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ success: false, message: 'Faltan coordenadas lat/lng' });
  }

  const locales = obtenerLocalesCercanos(parseFloat(lat), parseFloat(lng));
  res.status(200).json({ success: true, data: locales });
});

module.exports = router;
