const express = require('express');
const authControllers = require('../controllers/auth');

const router = express.Router();

router.post('/create', authControllers.create_user);
router.post('/login', authControllers.verify_login);

module.exports = router;