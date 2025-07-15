// routes/turnos.routes.js
const express = require('express');
const router = express.Router();

const { registrarTurno } = require('../core/reservas');

router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const resultado = await registrarTurno(data);
    res.status(200).json({ success: true, message: 'Turno registrado', data: resultado });
  } catch (err) {
    console.error('Error al registrar turno:', err);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

module.exports = router;
