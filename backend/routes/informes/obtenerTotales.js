const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

router.get("/obtenerTotales", async (req, res) => {
    const idLiderSelected = req.query.id;
    
    try{
        if (idLiderSelected == 0 || idLiderSelected === undefined){
            const result = await db.query("SELECT * FROM obtener_totales_coordinador(0, NULL, NULL)");

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No se encontraron totales" });
        }
        return res.json({
            message: "Totales obtenidos exitosamente NEW",
            result: result.rows
        });
    }else{
        const result = await db.query("SELECT * FROM obtener_totales_coordinador($1, NULL, NULL)",
            [idLiderSelected]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No se encontraron totales" });
        }
        return res.json({
            message: "Totales obtenidos exitosamente",
            result: result.rows
        });
    }
        
    }catch (error) {
        console.error("Error al obtener totales:", error);
        res.status(500).json({ error: "Error al obtener totales" });
    }
})

module.exports = router;