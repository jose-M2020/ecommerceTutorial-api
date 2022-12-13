'use strict'
const express = require('express');
const controller = require('../controllers/ReviewController');
const { verifyToken } = require('../middlewares/auth');

const api = express.Router();

api.post('/', verifyToken, controller.addItem);
api.get('/producto/:id', controller.getItemsByProduct);
api.get('/producto/:id/clientInfo', controller.getItemsByProductWithClientInfo);
api.get('/cliente/:id', verifyToken, controller.getitemsByClient);

module.exports = api;
