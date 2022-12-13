'use strict'
const express = require('express');
const controller = require('../controllers/VentaController');
const { verifyToken, roleAuthorization } = require('../middlewares/auth');

const api = express.Router();

api.get('/cliente/:id', verifyToken, controller.getItemsByClient);
api.get('/:id', verifyToken, controller.getItemDetails);
api.get('/consultarIDPago/:id', verifyToken, controller.consultarIDPago);
api.post('/', verifyToken, controller.addItem);

api.post('/pedido',
    verifyToken,
    // roleAuthorization(['admin']),
    controller.newOrder
);
api.get('/',
    verifyToken,
    roleAuthorization(['admin']),
    controller.getItems
);
api.get('/:id',
    verifyToken,
    roleAuthorization(['admin']),
    controller.getItem
);
api.put('/:id/setFinished',
    verifyToken,
    roleAuthorization(['admin']),
    controller.setFinished
);
api.delete('/:id',
    verifyToken,
    roleAuthorization(['admin']),
    controller.deleteItem
);
api.put('/:id/setShipped',
    verifyToken,
    roleAuthorization(['admin']),
    controller.setShipped
);
api.put('/:id/confirmPayment',
    verifyToken,
    roleAuthorization(['admin']),
    controller.confirmPayment
);
api.post('/register',
    verifyToken,
    roleAuthorization(['admin']),
    controller.addItemManual
);
api.post('/KPI/mensuales',
    verifyToken,
    roleAuthorization(['admin']),
    controller.kpi
);

module.exports = api;