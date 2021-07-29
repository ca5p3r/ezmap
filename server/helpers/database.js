const { Pool } = require('pg');

const dbSettings = require('../settings/database.json');

const pgConnector = {
    host: dbSettings.host,
    port: dbSettings.port,
    user: dbSettings.username,
    password: dbSettings.password,
    database: dbSettings.database,
    getConnection: function (database) {
        const pool = new Pool({
            host: this.host,
            port: this.port,
            user: this.user,
            password: this.password,
            database: database,
            query_timeout: 5000,
            connectionTimeoutMillis: 10000,
            idleTimeoutMillis: 10000
        });
        return pool;
    }
};

const initQuerier = (pool, query) => {
    pool.connect((err, client, done) => {
        if (err) {
            return err;
        };
        client.query(query, (err) => {
            done();
            if (err && err.code !== '42P04') {
                return err;
            }
            else {
                return null;
            }
        });
    });
};

module.exports = {
    pgConnector,
    initQuerier
};