// services/dbService.js
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/turnos.json');

async function guardarTurno(turno) {
  let turnos = [];
  if (fs.existsSync(DB_PATH)) {
    const raw = fs.readFileSync(DB_PATH);
    turnos = JSON.parse(raw);
  }

  turno.id = Date.now();
  turnos.push(turno);

  fs.writeFileSync(DB_PATH, JSON.stringify(turnos, null, 2));
  console.log('📦 Turno guardado en la base local');
}

module.exports = { guardarTurno };
