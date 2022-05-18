import { Router } from 'express';
import { load_settings, save_settings } from '../controllers/settings.js';

export const settingsRouters = Router();
settingsRouters.post('/getSettings', load_settings);
settingsRouters.post('/saveSettings', save_settings);