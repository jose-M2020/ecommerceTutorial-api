const Direccion = require('../models/Direccion');

const addItem  = async function(req,res){
    if(req.user){
        var data = req.body;

        if(data.principal){
            let direcciones = await Direccion.find({cliente:data.cliente});

            direcciones.forEach(async element => {
                await Direccion.findByIdAndUpdate({_id:element._id},{principal:false});
            });
        }
        
        let reg = await Direccion.create(data);
        res.status(200).send({data:reg});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const getItemsByClient  = async function(req,res){
    if(req.user){
        var id = req.params['id'];
        let direcciones = await Direccion.find({cliente:id,status:true}).populate('cliente').sort({createdAt:-1});
        res.status(200).send({data:direcciones});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const setDefault  = async function(req,res){
    if(req.user){
        var id = req.params['id'];
        var cliente = req.params['cliente'];

        let direcciones = await Direccion.find({cliente:cliente});

        direcciones.forEach(async element => {
            await Direccion.findByIdAndUpdate({_id:element._id},{principal:false});
        });

        await Direccion.findByIdAndUpdate({_id:id},{principal:true});
 
        res.status(200).send({data:true});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const disableItem = async function(req,res){
    if(req.user){
        var id = req.params['id'];
        let direcciones = await Direccion.findByIdAndUpdate({_id:id},{status:false});
        res.status(200).send({data:direcciones});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

module.exports = {
    addItem,
    getItemsByClient,
    setDefault,
    disableItem
}