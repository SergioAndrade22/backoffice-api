require('dotenv').config();
const { Client } = require('pg');

const COLUMNS = "id, name, cuisine, is_vege, is_vegan, is_coeliac, has_alcohol, cost, picture";

const TABLE = "items";

function getQuery(id = false) {
    return id ? `SELECT ${COLUMNS} FROM ${TABLE} WHERE id = ${id}` : `SELECT ${COLUMNS} FROM ${TABLE}`;
}

function getPictureQuery(id) {
    return `SELECT picture FROM ${TABLE} WHERE id = ${id}`;
}

function getClient() {
    return new Client({
        connectionString: process.env.CONNECTION_URL,
        ssl: {
            rejectUnauthorized: false,
        },
    });
}

module.exports = {
    getQuery,
    getPictureQuery,
    getClient,
};