// main.js
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();


// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
const turnosRoutes = require('./routes/turnos.routes');
app.use('/api/turnos', turnosRoutes);

const localesRoutes = require('./routes/locales.routes');
app.use('/api/locales', localesRoutes);

// Admin para dueño local
const adminRoutes = require('./routes/admin.routes');
app.use('/api/admin', adminRoutes);



// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
