const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

router.get("/obtenerInforme", async (req, res) => {
    try{}catch (error) {
        console.error("Error al obtener datos de informes:", error);
        res.status(500).json({ error: "Error al obtener datos de informes" });
    }
})

module.exports = router;
