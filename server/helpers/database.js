import pkg from 'pg';
const { Pool } = pkg;
import { obj } from '../settings/database.js';

const config = {
    host: obj.host || 'localhost',
    port: obj.port || '5432',
    user: obj.username || 'postgres',
    password: obj.password || 'postgres',
    database: obj.database || 'postgres'
};

export const pool = new Pool(config);