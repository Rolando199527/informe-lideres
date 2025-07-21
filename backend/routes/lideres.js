const express = require('express');
const router = express.Router();
const db = require('../db/connection');

router.get("/", async (req, res) => {
  try {
    const result = await db.query('SELECT "nombreLider" FROM coordinadoresLideres ORDER BY "nombreLider" ASC');
    console.log("Lideres:", result.rows);
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