const express = require("express");
const cord = require("cors");
const db = require("./db/connection");
require("dotenv").config();

const app = express();
app.use(cord());
app.use(express.json());

// ruta de prueba
app.get("/diaconados", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM diaconado ORDER BY name ASC");
    console.log("Conexión exitosa a la base de datos:", result.rows);
    res.json({
      message: "Conexión exitosa a la base de datos",
      result: result.rows,
    });
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
    res.status(500).json({ error: "Error al conectar a la base de datos" });
  }
});

const coordinadoresRoutes = require('./routes/diaconoCoordinador');
app.use('/api', coordinadoresRoutes);

const lideresRoutes = require('./routes/lideres');
app.use('/api/lideres', lideresRoutes);

const discipulosRoutes = require('./routes/discipulos');
app.use('/api', discipulosRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto: ${PORT}`);
});
