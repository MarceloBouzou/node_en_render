// --- Sin cambios en la parte del mapa ---
const map = L.map('map').setView([-34.6037, -58.3816], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

navigator.geolocation.getCurrentPosition(async (pos) => {
  const { latitude, longitude } = pos.coords;
  L.marker([latitude, longitude]).addTo(map).bindPopup("Estás acá").openPopup();
  map.setView([latitude, longitude], 14);

  const res = await fetch(`/api/locales?lat=${latitude}&lng=${longitude}`);
  const data = await res.json();

  data.data.forEach((local) => {
    L.marker([local.lat, local.lng]).addTo(map)
      .bindPopup(`<strong>${local.nombre}</strong><br><button onclick="seleccionarLocal(${local.id})">Reservar</button>`);
  });
});

function seleccionarLocal(id) {
  document.getElementById('formulario').style.display = 'block';
  document.getElementById('localId').value = id;
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

// --- FUNCIÓN MEJORADA ---
function cerrarFormulario() {
  // 1. Oculta el contenedor principal del formulario
  document.getElementById('formulario').style.display = 'none';
  
  // 2. Resetea los campos del formulario para que estén vacíos la próxima vez
  document.getElementById('turnoForm').reset();
  
  // 3. Limpia cualquier mensaje de éxito o error
  document.getElementById('mensaje').innerHTML = '';
  
  // 4. (IMPORTANTE) Asegura que el formulario interno vuelva a ser visible
  document.getElementById('turnoForm').style.display = 'block';

  // 5. (IMPORTANTE) Asegura que el botón de submit esté habilitado
  const btn = document.querySelector('#turnoForm button[type="submit"]');
  btn.disabled = false;
}

// --- LISTENER DE SUBMIT MEJORADO ---
document.getElementById('turnoForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const submitButton = e.target.querySelector('button[type="submit"]');
  const mensaje = document.getElementById('mensaje');
  
  // Deshabilitamos el botón para evitar envíos duplicados
  submitButton.disabled = true;
  mensaje.innerHTML = 'Enviando reserva...'; // Mensaje de carga opcional

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
      
      // Ocultamos solo los campos del formulario para que el mensaje de éxito se vea claramente
      document.getElementById('turnoForm').style.display = 'none';

      // Esperamos 3 segundos para que el usuario lea el mensaje y luego cerramos todo.
      setTimeout(() => {
        cerrarFormulario();
      }, 3000); // Aumentado a 3 segundos para mejor UX

    } else {
      // Si falla, mostramos el error y rehabilitamos el botón
      mensaje.innerHTML = `❌ ${json.message || 'Hubo un problema al enviar la reserva. Inténtalo nuevamente.'}`;
      submitButton.disabled = false;
    }
  } catch (error) {
    // Si hay un error de red, también lo manejamos
    mensaje.innerHTML = '❌ Error de conexión. No se pudo enviar la reserva.';
    submitButton.disabled = false;
  }
});