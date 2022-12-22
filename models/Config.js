'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// var ConfigSchema = Schema({
//     envio_activacion: {type: String, required: true},
//     monto_min_mexicanos: {type: Number, required: true},
//     monto_min_dolares: {type: Number, required: true},
//     createdAt: {type:Date, default: Date.now, require: true}
// });

var ConfigSchema = Schema({
    nombreTienda: {type: String, required: true},
    logo: {
      name: {type: String, required: true},
      secure_url: {type: String, required: true},
      public_id: {type: String, required: true},
    },
    envio: {
      envio_activacion: {type: String, required: true},
      monto_min_mexicanos: {type: Number, required: true},
      monto_min_dolares: {type: Number, required: true},
    }
});

module.exports =  mongoose.model('config',ConfigSchema);