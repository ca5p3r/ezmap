import express from 'express';
import { create_user, verify_login } from '../controllers/auth.js';

export const authRouters = express.Router();

authRouters.post('/create', create_user);
authRouters.post('/login', verify_login);