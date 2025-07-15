const map = L.map('map').setView([-34.7723, -58.2220], 13); // Berazategui por defecto
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

let marcadorUsuario = null;

function cargarLocales(lat, lng) {
  fetch(`/api/locales?lat=${lat}&lng=${lng}`)
    .then(res => res.json())
    .then(data => {
      // Primero removemos todos los marcadores actuales (si querés hacer esto)
      // También podés agregar lógica para evitar duplicados
      data.data.forEach((local) => {
        L.marker([local.lat, local.lng]).addTo(map)
          .bindPopup(`<strong>${local.nombre}</strong><br><button onclick="seleccionarLocal(${local.id})">Reservar</button>`);
      });
    })
    .catch(err => {
      console.error("Error cargando locales:", err);
    });
}

function marcarUbicacion(lat, lng) {
  if (marcadorUsuario) {
    map.removeLayer(marcadorUsuario);
  }
  marcadorUsuario = L.marker([lat, lng]).addTo(map).bindPopup("Estás acá").openPopup();
  map.setView([lat, lng], 14);
}

// --- Intentamos geolocalizar ---
if (!navigator.geolocation) {
  alert("Tu navegador no soporta geolocalización.");
  cargarLocales(-34.7723, -58.2220);
} else {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      marcarUbicacion(latitude, longitude);
      cargarLocales(latitude, longitude);
    },
    (err) => {
      alert("No se pudo obtener tu ubicación. Se usará ubicación estimada.");
      marcarUbicacion(-34.7723, -58.2220);
      cargarLocales(-34.7723, -58.2220);
    }
  );
}

// --- Cada vez que el mapa se mueva o se haga zoom, recargamos locales ---
map.on('moveend zoomend', () => {
  const center = map.getCenter();
  cargarLocales(center.lat, center.lng);
});

// --- FORMULARIO ---
function seleccionarLocal(id) {
  document.getElementById('formulario').style.display = 'block';
  document.getElementById('localId').value = id;
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

function cerrarFormulario() {
  document.getElementById('formulario').style.display = 'none';
  document.getElementById('turnoForm').reset();
  document.getElementById('mensaje').innerHTML = '';
  document.getElementById('turnoForm').style.display = 'block';
  document.querySelector('#turnoForm button[type="submit"]').disabled = false;
}

document.getElementById('turnoForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const submitButton = e.target.querySelector('button[type="submit"]');
  const mensaje = document.getElementById('mensaje');
  submitButton.disabled = true;
  mensaje.innerHTML = 'Enviando reserva...';

  const body = {
    nombre: document.getElementById('nombre').value,
    telefono: document.getElementById('telefono').value,
    fecha: document.getElementById('fecha').value,
    hora: document.getElementById('hora').value,
    servicio: document.getElementById('servicio').value,
    localId: parseInt(document.getElementById('localId').value)
  };

  try {
    const res = await fetch('/api/turnos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const json = await res.json();

    if (json.success) {
      mensaje.innerHTML = '✅ Tu reserva fue recibida. En breve nos comunicaremos para confirmarla.';
      document.getElementById('turnoForm').style.display = 'none';
      setTimeout(cerrarFormulario, 3000);
    } else {
      mensaje.innerHTML = `❌ ${json.message || 'Hubo un problema al enviar la reserva. Inténtalo nuevamente.'}`;
      submitButton.disabled = false;
    }
  } catch (error) {
    mensaje.innerHTML = '❌ Error de conexión. No se pudo enviar la reserva.';
    submitButton.disabled = false;
  }
});
