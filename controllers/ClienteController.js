var Cliente = require('../models/Cliente');
var bcrypt = require('bcrypt-nodejs');

const getItems = async function(req,res){
    if(req.user){
        const data = await Cliente.find();
        res.status(200).send({data});
    }else{
        res.status(500).send({message: 'NoAccess'});
    } 
}

const getItem = async function(req,res){
    if(req.user){
        var id = req.params['id'];

        try {
            var reg = await Cliente.findById({_id:id});

            res.status(200).send({data:reg});
        } catch (error) {
            res.status(200).send({data:undefined});
        }
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const updateItem = async function(req,res){
    if(req.user){
        var id = req.params['id'];
        var data = req.body;

        if(data.password){
            bcrypt.hash(data.password,null,null, async function(err,hash){
                var reg = await Cliente.findByIdAndUpdate({_id:id},{
                    nombres: data.nombres,
                    apellidos: data.apellidos,
                    telefono :data.telefono,
                    f_nacimiento: data.f_nacimiento,
                    dni: data.dni,
                    password: hash,
                });
                res.status(200).send({data:reg});
            });
            
        }else{
            var reg = await Cliente.findByIdAndUpdate({_id:id},{
                nombres: data.nombres,
                apellidos: data.apellidos,
                telefono :data.telefono,
                f_nacimiento: data.f_nacimiento,
                dni: data.dni,
            });
            res.status(200).send({data:reg});
        }
        
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

module.exports = {
  getItem,
  getItems,
  updateItem,
}