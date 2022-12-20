'use strict'
const express = require('express');
const controller = require('../controllers/ProductoController');
const fileUpload = require("express-fileupload");
const path = fileUpload({
    useTempFiles: true,
    tempFileDir: "./uploads",
});
const { verifyToken, roleAuthorization } = require('../middlewares/auth');

const api = express.Router();

api.get('/', controller.getPublicItems);
api.get('/slug/:slug', controller.getItemBySlug);
api.get('/nuevos', controller.getNewItems);
api.get('/destacados', controller.getFeaturedItems);
api.get('/recomendados/:categoria', controller.getRecommendedItems);
api.get('/variedades/:id', controller.getVariedades);
api.get('/portada/:img', controller.getImgCover);

api.get('/:id/etiquetas',
    verifyToken,
    roleAuthorization(['admin']),
    controller.getEtiquetas
);
api.delete('/:id/etiqueta',
    verifyToken,
    roleAuthorization(['admin']),
    controller.deleteEtiqueta
);
api.post('/etiqueta',
    verifyToken,
    roleAuthorization(['admin']),
    controller.addEtiqueta
);
api.post('/',
    [verifyToken,path], 
    roleAuthorization(['admin']),
    controller.addItem
);
api.get('/all',
    verifyToken,
    roleAuthorization(['admin']),
    controller.getAllItems
);
api.get('/:id',
    verifyToken,
    roleAuthorization(['admin']),
    controller.getItem
);
api.put('/:id',
    [verifyToken,path], 
    roleAuthorization(['admin']),
    controller.updateItem
);
api.put('/:id/variedad',
    verifyToken,
    roleAuthorization(['admin']),
    controller.updateVariedad
);
api.get('/:id/:estado/changeStatus',
    verifyToken,
    roleAuthorization(['admin']),
    controller.changeStatus
);
// api.get('/obtener_portada/:img', controller.obtener_portada);
api.put('/:id/addImage',
    [verifyToken,path], 
    roleAuthorization(['admin']),
    controller.addImage
);
api.put('/:id/deleteImage',
    verifyToken,
    roleAuthorization(['admin']),
    controller.deleteImage
);

api.get('/:id/inventario',
    // verifyToken,
    // roleAuthorization(['admin']),
    controller.getInventarioByProduct
);
api.get('/inventario/all',
    verifyToken,
    roleAuthorization(['admin']),
    controller.getInventario
);
api.post('/inventario',
    verifyToken,
    roleAuthorization(['admin']),
    controller.addInventario
);

module.exports = api;