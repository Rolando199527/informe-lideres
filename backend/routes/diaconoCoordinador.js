const express = require("express");
const router = express.Router();
const db = require("../db/connection");

router.get("/diaconoCoordinador", async (req, res) => {
  const { name } = req.query;

  try {
    if (name) {
      const result = await db.query(
        'SELECT "diaconoCoordinador" FROM coordinadoreslideres WHERE "nombreLider" ILIKE $1 LIMIT 1',
        [name]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: "No se encontró ningún registro" });
      }

      return res.json({
        message: "Conexión exitosa a la base de datos",
        result: result.rows,
      });
    } else {
      // Si no se pasa name, podrías devolver una lista completa
      const result = await db.query(
        'SELECT * FROM coordinadoreslideres ORDER BY "nombreLider" ASC'
      );

      return res.json({
        message: "Todos los coordinadores",
        result: result.rows,
      });
    }
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
    return res.status(500).json({ error: "Error al conectar a la base de datos" });
  }
});

module.exports = router;
