const { Pool } = require('pg');
require('dotenv').config();


const pool = new Pool({
    host: process.env.HOST,
    port: process.env.PORT,
    database: process.env.DATABASE,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
});

module.exports = pool;