const express = require("express");
const router = express.Router();
const db = require("../db/connection");

router.get("/superior", async (req, res) => {
  const { id } = req.query;

  // Validación básica
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Debes proporcionar un ID numérico válido" });
  }

  try {
    const result = await db.query(
      "SELECT * FROM obtener_superior($1)",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No se encontró un superior para este miembro" });
    }

    return res.json({
      message: "Superior encontrado exitosamente",
      result: result.rows[0] // Devuelve solo un resultado
    });

  } catch (error) {
    console.error("Error al ejecutar el procedimiento almacenado:", error);
    return res.status(500).json({ error: "Error al obtener el superior desde la base de datos" });
  }
});

module.exports = router;
