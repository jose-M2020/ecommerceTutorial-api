'use strict'
const express = require('express');
const controller = require('../controllers/ConfigController');
const fileUpload = require("express-fileupload");
const path = fileUpload({
    useTempFiles: true,
    tempFileDir: "./uploads",
});

const api = express.Router();
const { verifyToken } = require('../middlewares/auth');

api.get('/', controller.getConfig);
api.put('/', verifyToken, path, controller.updateConfig);

module.exports = api;