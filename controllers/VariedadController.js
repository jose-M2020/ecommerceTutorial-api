const Producto = require('../models/Producto');
const Variedad = require('../models/Variedad');
const ProductoEtiqueta = require('../models/Producto_etiqueta');

const fs = require('fs');
const path = require('path');

const getItemsByProduct = async function(req,res){
    if(req.user){
        var id = req.params['id'];
        let data = await Variedad.find({producto:id});
        res.status(200).send({data:data});
        
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const deleteItem = async function(req,res){
    if(req.user){
        var id = req.params['id'];

        let reg = await Variedad.findByIdAndRemove({_id:id});
        res.status(200).send({data:reg});
            
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const addItem = async function(req,res){
    if(req.user){
        var data = req.body;
        let reg = await Variedad.create(data);

        res.status(200).send({data:reg});
        
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const getItemsWithProduct = async function(req,res){
    if(req.user){
        var productos = await Variedad.find().populate('producto');
        res.status(200).send({data:productos});
    }else{
        res.status(500).send({message: 'NoAccess'});
    } 
}

module.exports = {
  getItemsByProduct,
  addItem,
  deleteItem,
  getItemsWithProduct 
}