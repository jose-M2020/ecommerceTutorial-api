const Carrito = require('../models/Carrito');
const Inventario = require('../models/Inventario');

const addItem = async function(req,res){
    if(req.user){
        const data = req.body;
        const cartFound = await Carrito.findOne({inventario: data.inventario});

        const inventario = await Inventario.findById({_id:data.inventario});
        
        const cantidadTotal = cartFound ? (data.cantidad + cartFound.cantidad) : (data.cantidad)
        
        if(cantidadTotal > inventario.cantidad){
          return res.status(200).send({data:undefined,message: 'Stock insuficiente, ingrese otra cantidad'});
        }

        if(cartFound){
          let reg = await Carrito.findByIdAndUpdate(
            {_id: cartFound._id},
            {cantidad: cantidadTotal}
          );

          res.status(200).send({data:reg});
        }else{
          let reg = await Carrito.create(data);
          res.status(200).send({data:reg});
        }

    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const getItemsByClient = async function(req,res){
    if(req.user){
        let id = req.params['id'];

        let carrito_cliente = await Carrito.find({cliente:id})
                                           .populate('producto')
                                           .populate({
                                                path: 'inventario',
                                                populate: { path: 'variedad'}
                                            });
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
                let inventario = await Inventario.findById({_id:item.inventario}).populate('producto');
                if(inventario.cantidad < item.cantidad){
                    access = true;
                    producto_sl = inventario.producto.titulo;
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