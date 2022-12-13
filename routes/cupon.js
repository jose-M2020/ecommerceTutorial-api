'use strict'
const express = require('express');
const controller = require('../controllers/CuponController');
const { verifyToken, roleAuthorization } = require('../middlewares/auth');

const api = express.Router();

api.get('/',
    verifyToken,
    controller.getItems
);
api.get('/:id',
    verifyToken,
    controller.getItem
);
api.get('/validar/:cupon',
    verifyToken,
    controller.validate
);
api.post('/',
    verifyToken,
    roleAuthorization(['admin']),
    controller.addItem
);
api.put('/:id',
    verifyToken,
    roleAuthorization(['admin']),
    controller.updateItem
);
api.delete('/:id',
    verifyToken,
    roleAuthorization(['admin']),
    controller.deleteItem
);

module.exports = api;