'use strict'
const express = require('express');
const controller = require('../controllers/ContactoController');

const api = express.Router();

api.post('/', controller.addItem);

module.exports = api;