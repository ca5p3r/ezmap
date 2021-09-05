import { Router } from 'express';
import { identify, spatial_search, simple_search, coordsToPolygon } from '../controllers/query.js';

export const queryRouters = Router();
queryRouters.post('/identify', identify);
queryRouters.post('/ssearch', spatial_search);
queryRouters.post('/tsearch', simple_search);
queryRouters.post('/createPolygon', coordsToPolygon);