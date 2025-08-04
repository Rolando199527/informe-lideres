const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

router.get("/obtenerInforme", async (req, res) => {
    try{
        const result = await db.query("SELECT * FROM obtener_informes_desde(NULL, NULL)", 
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No se encontraron informes" });
        }
        return res.json({
            message: "Informes obtenidos exitosamente",
            result: result.rows
        });
    }catch (error) {
        console.error("Error al obtener datos de informes:", error);
        res.status(500).json({ error: "Error al obtener datos de informes" });
    }
})

module.exports = router;
