import { Router } from 'express';
import { query } from '../controllers/query.js';

export const queryRouters = Router();
queryRouters.post('/query', query);