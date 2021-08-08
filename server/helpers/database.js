const { Pool } = require('pg');

const dbSettings = require('../settings/database.json');

const config = {
    host: dbSettings.host || 'localhost',
    port: dbSettings.port || '5432',
    user: dbSettings.username || 'postgres',
    password: dbSettings.password || 'postgres',
    database: dbSettings.database || 'postgres'
};

const pool = new Pool(config);

module.exports = {
    pool
};