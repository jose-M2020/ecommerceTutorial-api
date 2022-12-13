'use strict'
const express = require('express');
const controller = require('../controllers/ConfigController');

const api = express.Router();
const { verifyToken } = require('../middlewares/auth');

api.get('/', controller.getConfig);
api.put('/', verifyToken, controller.updateConfig);

module.exports = api;