const authController = require('../controllers/auth.controller');
const passwordVerify = require('../config/password.validate');
const express = require('express');
const router = express.Router();

router.post('/signup', passwordVerify.verifyPassword, authController.signup);
router.post('/login', authController.login);

module.exports = router;
