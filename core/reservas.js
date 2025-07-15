// core/reservas.js
const { enviarEmail } = require('../services/emailService');
const { guardarTurno } = require('../services/dbService');

async function registrarTurno(data) {
  const turno = {
    nombre: data.nombre,
    telefono: data.telefono,
    fecha: data.fecha,
    hora: data.hora,
    localId: data.localId,
    servicio: data.servicio
  };

  // Guardar turno en la "base de datos"
  await guardarTurno(turno);

  // Enviar notificación por email
  await enviarEmail(turno);

  return turno;
}

module.exports = { registrarTurno };
