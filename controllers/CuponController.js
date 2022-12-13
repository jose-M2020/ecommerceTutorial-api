var Cupon = require('../models/Cupon');

const addItem = async function(req,res){
    if(req.user){
        let data = req.body;
        let reg = await Cupon.create(data);
        res.status(200).send({data:reg});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}


const getItems = async function(req,res){
    if(req.user){
        var cupones = await Cupon.find();
        res.status(200).send({data:cupones});
    }else{
        res.status(500).send({message: 'NoAccess'});
    } 
}

const getItem = async function(req,res){
    if(req.user){
        var id = req.params['id'];

        try {
            var reg = await Cupon.findById({_id:id});
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
        var data = req.body;
        var id = req.params['id'];

        let reg = await Cupon.findByIdAndUpdate({_id:id},{
            codigo: data.codigo,
            tipo: data.tipo,
            valor: data.valor,
            limite: data.limite,
            disponibilidad: data.disponibilidad,
        });

        res.status(200).send({data:reg});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const deleteItem = async function(req,res){
    if(req.user){
        var id = req.params['id'];

        let reg = await Cupon.findByIdAndRemove({_id:id});
        res.status(200).send({data:reg});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}


const validate = async function(req,res){
    if(req.user){
        var cupon = req.params['cupon'];

        var data = await Cupon.findOne({codigo:cupon});

        if(data){
           if(data.limite == 0){
             res.status(200).send({data:undefined,message: 'Se superó el mimite máximo de canjes'});
           }else{
             res.status(200).send({data:data});
           }
        }else{
            res.status(200).send({data:undefined,message: 'El cupón no existe'});
        }

    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}


module.exports = {
    addItem,
    getItems,
    getItem,
    updateItem,
    deleteItem,
    validate
}