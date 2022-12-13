'use strict'

const express = require('express');
const AdminController = require('../controllers/AdminController');

const api = express.Router();
const { verifyToken } = require('../middlewares/auth');
const multiparty = require('connect-multiparty');
const path = multiparty({uploadDir: './uploads/productos'});



module.exports = api;