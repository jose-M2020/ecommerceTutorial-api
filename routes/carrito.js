'use strict'
const express = require('express');
const controller = require('../controllers/CarritoController');
const { verifyToken } = require('../middlewares/auth');

const api = express.Router();

api.post('/', verifyToken, controller.addItem);
api.get('/:id', verifyToken, controller.getItemsByClient);
api.delete('/:id', verifyToken, controller.deleteItem);
api.post('/check', verifyToken, controller.checkItems);

module.exports = api;