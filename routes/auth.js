'use strict'
const express = require('express');
const controller = require('../controllers/AuthController');
const { verifyToken } = require('../middlewares/auth');
const api = express.Router();

api.post('/admin/login', controller.loginAdmin);
api.post('/admin/registro', controller.registerAdmin);
api.post('/login', controller.login);
api.post('/registro', controller.register);
api.get('/verifyToken', verifyToken, controller.verifyToken);

module.exports = api;