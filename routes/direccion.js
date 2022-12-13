'use strict'
const express = require('express');
const controller = require('../controllers/DireccionController');
const { verifyToken } = require('../middlewares/auth');

const api = express.Router();

api.post('/', verifyToken, controller.addItem);
api.get('/cliente/:id', verifyToken, controller.getItemsByClient);
api.put('/setDefault/:id/:cliente', verifyToken, controller.setDefault);
api.get('/delete/:id', verifyToken, controller.disableItem);

module.exports = api;