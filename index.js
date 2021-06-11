require('dotenv').config();

const { Client } = require('pg');

const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.status(200).json({
        ok: true,
        message: "Connection stable",
    });
});

app.get('/menu', (req, res) => {
    const client = new Client({
        connectionString: process.env.CONNECTION_URL,
        ssl: {
            rejectUnauthorized: false,
        },
    });

    client.connect();

    client.query('SELECT name, cuisine FROM items', (error, result) => {
        if (result)
            res.status(200).json({
                ok: true,
                menu: result.rows,
            });
        else 
            res.status(500).json({
                ok: false,
                error
            });
        client.end();
    });
});

app.listen(3000, () => {
    console.log('Server status: \x1b[32m%s\x1b[0m', 'online');
}); // specifies port to listen in and function to display a message when loaded