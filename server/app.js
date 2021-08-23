import { readFileSync } from 'fs';
import { resolve } from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import morgan from 'morgan';
import express from 'express';
import json from 'body-parser';
import { authRouters } from './routes/auth.js';
import { settingsRouters } from './routes/settings.js';
import { queryRouters } from './routes/query.js';
import { pool } from './helpers/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const schema = readFileSync(resolve(__dirname, "./assets/schema.sql")).toString();


const app = express();

pool.connect((err, client, done) => {
    if (err) return done(err);
    client.query(schema, (err) => {
        done();
        if (err) console.log(err);
        else {
            app.listen(9000);
        };
    });
});

app.use(json());
app.use(morgan('dev'));

app.get('/', (_, res) => {
    res.send('<div><h3>Homepage</h3><p>This is the homepage endpoint for the backend server!</p></div>');
});

app.use('/auth', authRouters);
app.use('/config', settingsRouters);
app.use('/query', queryRouters);

app.use((_, res) => {
    res.status(404).send('<div><h3>Not Found</h3><p>You have reached an undefined endpoint!</p></div>');
});