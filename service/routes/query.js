import { Router } from 'express';
import { ssearch, tsearch } from '../controllers/query.js';

export const queryRouters = Router();
queryRouters.post('/spatial_query', ssearch);
queryRouters.post('/tabular_query', tsearch);