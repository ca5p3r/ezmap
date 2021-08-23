import { Router } from 'express';
import { identify } from '../controllers/query.js';

export const queryRouters = Router();

queryRouters.post('/identify', identify);