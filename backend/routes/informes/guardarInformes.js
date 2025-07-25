const express = require("express");
const router = express.Router();
const db = require("../../db/connection");

router.post("/guardarInforme", async (req, res) => {
  try {
    const {
      lideres,
      diaconoCoordinador,
      fecha,
      asistencia,
      redDiscipulos,
      nuevosDiscipulos,
      ofrenda,
      nombreNuevosDiscipulos,
    } = req.body;

    const {
      miercoles,
      viernes,
      sabado,
      domingo,
      santa_cena,
      doulos,
      contactado,
    } = asistencia;
    const query = `
    INSERT INTO informes (lider_id, diacono_coordinador, fecha, asistencia_miercoles,asistencia_viernes,asistencia_sabado,asistencia_domingo,asistencia_santa_cena,asistencia_doulos,contactado,red_discipulos,nuevos_discipulos, ofrenda, nombre_nuevos_discipulos)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING *
    `;
    const values = [
      parseInt(lideres),
      diaconoCoordinador,
      fecha,
      miercoles,
      viernes,
      sabado,
      domingo,
      santa_cena,
      doulos,
      contactado,
      parseInt(redDiscipulos),
      parseInt(nuevosDiscipulos),
      parseInt(ofrenda),
      nombreNuevosDiscipulos.filter((n) => n.trim() !== ""), // limpia valores vacíos
    ];
    const result = await db.query(query, values);
    res.status(200).json({
      message: "Informe guardado exitosamente",
      result: result.rows[0],
    });
  } catch (error) {
    console.error("Error al guardar datos de informes:", error);
    res.status(500).json({ error: "Error al obtener datos de informes" });
  }
});

module.exports = router;
