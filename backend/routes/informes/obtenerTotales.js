const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

router.get("/obtenerTotales", async (req, res) => {
    try{

        const result = await db.query("SELECT * FROM obtener_totales_informes()");
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No se encontraron totales" });
        }
        return res.json({
            message: "Totales obtenidos exitosamente",
            result: result.rows
        });
    }catch (error) {
        console.error("Error al obtener totales:", error);
        res.status(500).json({ error: "Error al obtener totales" });
    }
})

module.exports = router;