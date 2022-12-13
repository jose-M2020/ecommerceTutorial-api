'use strict'
const express = require('express');
const controller = require('../controllers/EtiquetaController');
const { verifyToken, roleAuthorization } = require('../middlewares/auth');

const api = express.Router();

api.get('/',
    verifyToken,
    roleAuthorization(['admin']),
    controller.getItems
);
api.post('/',
    verifyToken,
    roleAuthorization(['admin']),
    controller.addItem
);
api.delete('/:id',
    verifyToken,
    roleAuthorization(['admin']),
    controller.deleteitem
);

module.exports = api;