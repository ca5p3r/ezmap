import { readFileSync } from 'fs';
import { resolve, dirname } from "path";
import { fileURLToPath } from 'url';
import cors from 'cors';
import morgan from 'morgan';
import express from 'express';
import helmet from 'helmet';
import json from 'body-parser';
import { authRouters } from './routes/auth.js';
import { settingsRouters } from './routes/settings.js';
import { queryRouters } from './routes/query.js';
import { pool } from './helpers/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const schema = readFileSync(resolve(__dirname, "./assets/schema.sql")).toString();

const app = express();
app.disable("x-powered-by");

let safeApp = express();
safeApp.use(helmet.hidePoweredBy());

pool.connect((connError, client, done) => {
    if (connError) return done(connError);
    client.query(schema, (clientError) => {
        done();
        if (clientError) console.log(clientError);
        else {
            safeApp.listen(9090);
        }
    });
});

let corsOptions = {
    origin: [
        'http://localhost:3000',
        'http://192.168.1.111:3000'
    ]
};

safeApp.use(cors(corsOptions));
safeApp.use(json());
safeApp.use(morgan('dev'));

safeApp.get('/', (_, res) => {
    res.send('<div><h3>Homepage</h3><p>This is the homepage endpoint for the backend server!</p></div>');
});

safeApp.use('/authService', authRouters);
safeApp.use('/configService', settingsRouters);
safeApp.use('/queryService', queryRouters);

safeApp.use((_, res) => {
    res.status(404).send('<div><h3>Not Found</h3><p>You have reached an undefined endpoint!</p></div>');
});