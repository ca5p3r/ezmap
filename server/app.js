import { readFileSync } from 'fs';
import { resolve, dirname } from "path";
import { fileURLToPath } from 'url';
import cors from 'cors';
import morgan from 'morgan';
import express from 'express';
import json from 'body-parser';
import { authRouters } from './routes/auth.js';
import { settingsRouters } from './routes/settings.js';
import { queryRouters } from './routes/query.js';
import { pool } from './helpers/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const schema = readFileSync(resolve(__dirname, "./assets/schema.sql")).toString();

const app = express();

pool.connect((connError, client, done) => {
    if (connError) return done(connError);
    client.query(schema, (clientError) => {
        done();
        if (clientError) console.log(clientError);
        else {
            app.listen(9090);
        }
    });
});

app.use(cors());
app.use(json());
app.use(morgan('dev'));

app.get('/', (_, res) => {
    res.send('<div><h3>Homepage</h3><p>This is the homepage endpoint for the backend server!</p></div>');
});

app.use('/authService', authRouters);
app.use('/configService', settingsRouters);
app.use('/queryService', queryRouters);

app.use((_, res) => {
    res.status(404).send('<div><h3>Not Found</h3><p>You have reached an undefined endpoint!</p></div>');
});