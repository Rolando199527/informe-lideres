const express = require("express");
const router = express.Router();
const db = require("../db/connection");

// Obtener lista de discípulos filtrando por coordinadorLider
router.get("/discipulos", async (req, res) => {
  const { lider } = req.query; // ?nombre=Akemi
  console.log("Nombre del coordinadorLider:", lider);
  try {
    const result = await db.query(
      'SELECT name FROM discipulos WHERE coordinadorlider ILIKE $1 ORDER BY "name" ASC',
      [lider] // también puedes usar `%${nombre}%` para búsqueda parcial
    );

    res.json({
      message: "Conexión exitosa a la base de datos",
      result: result.rows,
    });
  } catch (error) {
    console.error("Error al consultar discípulos:", error);
    res.status(500).json({ error: "Error en la consulta de discípulos" });
  }
});

module.exports = router;
