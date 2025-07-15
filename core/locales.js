// core/locales.js
const path = require('path');
const fs = require('fs');
const { calcularDistanciaKm } = require('../utils/geoUtils');

function obtenerLocalesCercanos(lat, lng, maxDistKm = 10) {
  const dataPath = path.join(__dirname, '../data/locales.json');
  const locales = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  return locales
    .map((local) => {
      const distancia = calcularDistanciaKm(lat, lng, local.lat, local.lng);
      return { ...local, distancia };
    })
    .filter((local) => local.distancia <= maxDistKm)
    .sort((a, b) => a.distancia - b.distancia);
}

module.exports = { obtenerLocalesCercanos };
