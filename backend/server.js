const express = require('express');
const cord = require('cors');
const db = require('./db/connection');
require('dotenv').config();

const app = express();
app.use(cord());
app.use(express.json());

// ruta de prueba
app.get('/test-db',  async (req, res) => {
    try {
 const result = await db.query('SELECT NOW()');
 console.log('Conexión exitosa a la base de datos:', result.rows[0]);
        res.json({ message: 'Conexión exitosa a la base de datos', time: result[0] });

    }catch (error) {
        console.error('Error al conectar a la base de datos:', error);
        res.status(500).json({ error: 'Error al conectar a la base de datos' });
    }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto: ${PORT}`)
});