import express from 'express';
import { create_user, verify_login, gen_kc_token } from '../controllers/auth.js';

export const authRouters = express.Router();
authRouters.post('/register', create_user);
authRouters.post('/login', verify_login);
authRouters.post('/gen_token', gen_kc_token);