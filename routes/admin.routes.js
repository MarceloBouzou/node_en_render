// routes/admin.routes.js
const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

router.get('/turnos', (req, res) => {
  const { localId } = req.query;

  if (!localId) {
    return res.status(400).json({ success: false, message: 'Falta parámetro localId' });
  }

  const dataPath = path.join(__dirname, '../data/turnos.json');
  const turnos = fs.existsSync(dataPath)
    ? JSON.parse(fs.readFileSync(dataPath, 'utf8'))
    : [];

  const turnosFiltrados = turnos.filter(t => t.localId == localId);

  res.json({ success: true, data: turnosFiltrados });
});

module.exports = router;
