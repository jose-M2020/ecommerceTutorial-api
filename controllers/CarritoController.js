const Carrito = require('../models/Carrito');
const Variedad = require('../models/Variedad');

const addItem = async function(req,res){
    if(req.user){
        let data = req.body;

        let variedad = await Variedad.findById({_id:data.variedad});

        if(data.cantidad <= variedad.stock){
            let reg = await Carrito.create(data);
            res.status(200).send({data:reg});
        }else{
            res.status(200).send({data:undefined,message: 'Stock insuficiente, ingrese otra cantidad'});
        }

    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const getItemsByClient = async function(req,res){
    if(req.user){
        let id = req.params['id'];

        let carrito_cliente = await Carrito.find({cliente:id}).populate('producto').populate('variedad');
        res.status(200).send({data:carrito_cliente});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const deleteItem = async function(req,res){
    if(req.user){
        let id = req.params['id'];
        let reg = await Carrito.findByIdAndRemove({_id:id});
        res.status(200).send({data:reg});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const checkItems = async function(req,res){
    if(req.user){
        try {
            var data = req.body;
            var detalles = data.detalles;
            let access = false;
            let producto_sl = '';

            for(var item of detalles){
                let variedad = await Variedad.findById({_id:item.variedad}).populate('producto');
                if(variedad.stock < item.cantidad){
                    access = true;
                    producto_sl = variedad.producto.titulo;
                }
            }

            if(!access){
                res.status(200).send({venta:true});
            }else{
                res.status(200).send({venta:false,message:'Stock insuficiente para ' + producto_sl});
            }
        } catch (error) {
            console.log(error);
        }
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

module.exports = {
  addItem,
  getItemsByClient,
  deleteItem,
  checkItems
}