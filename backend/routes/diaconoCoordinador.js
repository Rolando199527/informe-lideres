const express = require("express");
const router = express.Router();
const db = require("../db/connection");

router.get("/diaconoCoordinador", async (req, res) => {
  const { name } = req.query;
  console.log("Lider seleccionado:", name);

  try {
    let result;

    if (name) {
      if (name) {
        const result = await db.query(
          'SELECT "diaconoCoordinador" FROM coordinadoreslideres WHERE "nombreLider" ILIKE $1',[name]);
        res.json({
          message: "Conexión exitosa a la base de datos",
          result: result.rows,
        });
      }
    } else {
      result = await db.query("SELECT * FROM coordinador ORDER BY name ASC");
    }

    res.json({
      message: "Conexión exitosa a la base de datos",
      result: result.rows,
    });
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
    res.status(500).json({ error: "Error al conectar a la base de datos" });
  }
});

module.exports = router;
