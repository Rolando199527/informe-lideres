const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

router.post("/guardarInforme", async (req, res) => {
    try{
        console.log("Datos recibidos:", req.body);
    }catch (error) {
        console.error("Error al guardar datos de informes:", error);
        res.status(500).json({ error: "Error al obtener datos de informes" });
    }
})

module.exports = router;
