'use strict'
const express = require('express');
const controller = require('../controllers/VariedadController');
const { verifyToken, roleAuthorization } = require('../middlewares/auth');

const api = express.Router();

api.get('/producto/:id',
    verifyToken,
    roleAuthorization(['admin']),
    controller.getItemsByProduct
);
api.delete('/:id',
    verifyToken,
    roleAuthorization(['admin']),
    controller.deleteItem
);
api.post('/',
    verifyToken,
    roleAuthorization(['admin']),
    controller.addItem
);
api.get('/productInfo',
    verifyToken,
    roleAuthorization(['admin']),
    controller.getItemsWithProduct
);

module.exports = api;