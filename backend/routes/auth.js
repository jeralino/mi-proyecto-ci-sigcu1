// routes/auth.js
const express = require('express');
const router = express.Router();
//const { register, login } = require('../controllers/authController');
const authController = require('../controllers/authController');

// Usa authController.register para evitar el error "register is not defined"
router.post('/register', authController.register);

// --- RUTA DE LOGIN DE CLIENTES (Original) ---
router.post('/login', authController.login);

// --- RUTA DE LOGIN ADMIN VIEW (Nueva Implementación) ---
router.post('/admin-login-view', authController.loginAdminView);

module.exports = router;