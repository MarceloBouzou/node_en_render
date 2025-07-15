// services/emailService.js
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

// Buscar el email del local desde locales.json
function obtenerEmailDelLocal(localId) {
  const dataPath = path.join(__dirname, '../data/locales.json');
  const locales = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  const local = locales.find((l) => l.id === localId);
  return local ? local.email : null;
}

async function enviarEmail(turno) {
  const emailDestino = obtenerEmailDelLocal(turno.localId);
  if (!emailDestino) return;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'takibreak@gmail.com',
      pass: 'TUPASS_O_APP_PASSWORD'
    }
  });

  const mailOptions = {
    from: '"Sistema de Turnos" <TUCORREO@gmail.com>',
    to: emailDestino,
    subject: `📅 Nueva reserva - ${turno.nombre}`,
    text: `Turno reservado:\nCliente: ${turno.nombre}\nTeléfono: ${turno.telefono}\nServicio: ${turno.servicio}\nFecha: ${turno.fecha} ${turno.hora}`
  };

  await transporter.sendMail(mailOptions);
  console.log(`📧 Email enviado a ${emailDestino}`);
}

module.exports = { enviarEmail };
