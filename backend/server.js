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
app.get("/coordinadores", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM coordinador ORDER BY name ASC"
    );
    console.log("coordinadores", result.rows);
    res.json({
      message: "Conexión exitosa a la base de datos",
      result: result.rows,
    });
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
    res.status(500).json({ error: "Error al conectar a la base de datos" });
  }
});
const lideresRoutes = require('./routes/lideres');
app.use('/api/lideres', lideresRoutes);


app.get("/discipulos", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM discipulos ORDER BY name ASC");
    console.log("Discipulos:", result.rows);
    res.json({
      message: "Conexión exitosa a la base de datos",
      result: result.rows,
    });
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
    res.status(500).json({ error: "Error al conectar a la base de datos" });
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto: ${PORT}`);
});
