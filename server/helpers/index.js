import pkg from 'pg';
const { Pool } = pkg;
import { connection, projections } from '../settings/index.js';
import proj4 from 'proj4';

const config = {
    host: connection.host || 'localhost',
    port: connection.port || '5432',
    user: connection.username || 'postgres',
    password: connection.password || 'postgres',
    database: connection.database || 'postgres'
};

export const pool = new Pool(config);

export const makeBuffer = (geom, point) => {
    let buffer;
    if (geom === 'Polygon' || geom === 'MultiPolygon' || geom === 'gml:MultiSurfacePropertyType') {
        buffer = 5
    }
    else {
        buffer = 100
    }
    const x = point[0];
    const y = point[1];
    const p1 = [x - buffer, y + buffer];
    const p2 = [x + buffer, y + buffer];
    const p3 = [x + buffer, y - buffer];
    const p4 = [x - buffer, y - buffer];
    const p5 = p1;
    return [p1, p2, p3, p4, p5]
};

export const tranform = (source, target, point) => {
    const sourceProj = projections[source];
    const targetProj = projections[target];
    return proj4(sourceProj, targetProj, point)
};