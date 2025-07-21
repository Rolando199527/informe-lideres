const express = require("express");
const router = express.Router();
const db = require("../db/connection");

// GET /api/subordinados/:id
router.get("/subordinados/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: "ID inválido. Debe ser un número." });
  }

  try {
    const result = await db.query(
      "SELECT * FROM obtener_subordinados($1)",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No se encontraron subordinados para este miembro." });
    }

    res.json({
      message: "Subordinados encontrados",
      result: result.rows,
    });
  } catch (error) {
    console.error("Error al ejecutar el procedimiento almacenado:", error);
    res.status(500).json({ error: "Error al consultar los subordinados" });
  }
});

module.exports = router;
