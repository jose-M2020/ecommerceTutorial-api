const Cliente = require('../models/Cliente');
const Carrito = require('../models/Carrito');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../helpers/jwt');

const addItem  = async function(req,res){
    let data = req.body;

    data.estado = 'Abierto';
    let reg = await Contacto.create(data);
    res.status(200).send({data:reg});
}

const getItems  = async function(req,res){
    if(req.user){
        if(req.user.role == 'admin'){

            let reg = await Contacto.find().sort({createdAt:-1});
            res.status(200).send({data:reg});

        }else{
            res.status(500).send({message: 'NoAccess'});
        }
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const setState  = async function(req,res){
    if(req.user){
        if(req.user.role == 'admin'){

            let id = req.params['id'];

            let reg = await Contacto.findByIdAndUpdate({_id:id},{estado: 'Cerrado'});
            res.status(200).send({data:reg});

        }else{
            res.status(500).send({message: 'NoAccess'});
        }
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

module.exports = {
    addItem
}