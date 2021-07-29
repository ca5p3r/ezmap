const express = require('express');
const authControllers = require('../controllers/auth');

const router = express.Router();

router.post('/create', authControllers.create_user);
router.get('/login', authControllers.verify_login);

module.exports = router;