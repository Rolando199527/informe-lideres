const express = require("express");
const cors = require("cors");
const db = require("./db/connection");
require("dotenv").config();

const app = express();
app.use(express.json());

// Configuración de CORS
app.use(
  cors({
   origin: [
      "https://informe-lideres.vercel.app", // URL corregida (sin https:// duplicado)
      "http://localhost:5500", // Añadido para Live Server (puerto 5500)
      "http://127.0.0.1:5500" // Añadido para la IP local
    ], 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


const superiorRoutes = require("./routes/superior");
app.use("/api", superiorRoutes);

const lideresRoutes = require("./routes/lideres");
app.use("/api/lideres", lideresRoutes);

const subordinadosRoutes = require("./routes/subordinados");
app.use("/api", subordinadosRoutes);

const guardarInformesRoutes = require("./routes/informes/guardarInformes");
app.use("/api", guardarInformesRoutes);

const obtenerDatosInformesRoutes = require("./routes/informes/obtenerDatosInformes");
app.use("/api", obtenerDatosInformesRoutes);

const obtenerTotalesRoutes = require("./routes/informes/obtenerTotales");
app.use("/api", obtenerTotalesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto: ${PORT}`);
});
