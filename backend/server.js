const express = require("express");
const cord = require("cors");
const db = require("./db/connection");
require("dotenv").config();

const app = express();
app.use(cord());
app.use(express.json());

// ruta de prueba

const superiorRoutes = require('./routes/superior');
app.use('/api', superiorRoutes);

const lideresRoutes = require('./routes/lideres');
app.use('/api/lideres', lideresRoutes);

const subordinadosRoutes = require('./routes/subordinados');
app.use('/api', subordinadosRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto: ${PORT}`);
});
