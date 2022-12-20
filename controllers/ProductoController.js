const Producto = require('../models/Producto');
const Variedad = require('../models/Variedad');
const Inventario = require('../models/Inventario');
const ProductoEtiqueta = require('../models/Producto_etiqueta');
const {uploadImage, removeImage} = require('../utils/cloudinary.js');

const fs = require('fs-extra');
const path = require('path');

const getPublicItems = async function(req,res){
    let data = [];
    let reg = await Producto.find({estado:'Publicado'}).sort({createdAt:-1});

    for(var item of reg){
        let variedades = await Variedad.find({producto:item._id});
        data.push({
            producto: item,
            variedades: variedades
        });
    }

    res.status(200).send({data});
}

const getVariedades = async function(req,res){
    let id = req.params['id'];
    let variedades = await Variedad.find({producto:id});
    res.status(200).send({data:variedades});
}

const getItemBySlug = async function(req,res){
    var slug = req.params['slug'];
    try {
        let producto = await Producto.findOne({slug: slug,estado:'Publicado'});
        if(producto == undefined){
            res.status(200).send({data:undefined});
        }else{
            res.status(200).send({data:producto});
        }
    } catch (error) {
        res.status(200).send({data:undefined});
    }
}

const getRecommendedItems = async function(req,res){
    var categoria = req.params['categoria'];
    let reg = await Producto.find({categoria: categoria,estado:'Publicado'}).sort({createdAt:-1}).limit(8);
    res.status(200).send({data: reg});
}

const getFeaturedItems = async function(req,res){
    let reg = await ProductoEtiqueta.find({etiqueta:"639a8e1e7d732603c70431ed"}).populate('producto');
    res.status(200).send({data: reg});
}

const getNewItems = async function(req,res){
    let reg = await Producto.find({estado: 'Publicado'}).sort({createdAt:-1}).limit(8);
    res.status(200).send({data: reg});
}

const getImgCover = async function(req,res){
    var img = req.params['img'];


    fs.stat('./uploads/productos/'+img, function(err){
        if(!err){
            let path_img = './uploads/productos/'+img;
            res.status(200).sendFile(path.resolve(path_img));
        }else{
            let path_img = './uploads/default.jpg';
            res.status(200).sendFile(path.resolve(path_img));
        }
    })
}



const addItem = async function(req,res){
    if(req.user){
        let data = req.body;
  
        let productos = await Producto.find({titulo:data.titulo});
        
        let arr_etiquetas = JSON.parse(data.etiquetas);
        
        if(productos.length == 0){
            // var img_path = req.files.portada.path;
            // var name = img_path.split('\\');
            // var portada_name = name[2];

            if (req.files?.portada) {
              const result = await uploadImage(req.files.portada.tempFilePath)
              data.portada = {
                name: req.files.portada.name,
                public_id: result.public_id,
                secure_url: result.secure_url
              }
              await fs.unlink(req.files.portada.tempFilePath)
            }
          
            data.slug = data.titulo.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
            // data.portada = portada_name;
          
            let reg = await Producto.create(data);

            if(arr_etiquetas.length >= 1){
                for(var item of arr_etiquetas){
                    await ProductoEtiqueta.create({
                        etiqueta: item.etiqueta,
                        producto: reg._id,
                    });
                }
            }

            res.status(200).send({data:reg});
        }else{
            res.status(200).send({data:undefined, message: 'El título del producto ya existe'});
        }
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const getAllItems = async function(req,res){
    if(req.user){
        var productos = await Producto.find();
        res.status(200).send({data:productos});
    }else{
        res.status(500).send({message: 'NoAccess'});
    } 
}

const getItem = async function(req,res){
    if(req.user){
        var id = req.params['id'];

        try {
            var reg = await Producto.findById({_id:id});
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
      const id = req.params['id'];
      const data = req.body;

      const portadaData = JSON.parse(data.portada);
      
      const newData = {
        titulo: data.titulo,
        stock: data.stock,
        precio_antes_mexicanos: data.precio_antes_mexicanos,
        precio_antes_dolares: data.precio_antes_dolares,
        precio: data.precio,
        precio_dolar: data.precio_dolar,
        peso: data.peso,
        sku: data.sku,
        categoria: data.categoria,
        visibilidad: data.visibilidad,
        descripcion: data.descripcion,
        contenido:data.contenido,
        genero:data.genero
      }
      
      if (req?.files) {
        try {
          await removeImage(portadaData.public_id);
          const result = await uploadImage(req.files.newImage.tempFilePath)
          newData.portada = {
            name: req.files.newImage.name,
            public_id: result.public_id,
            secure_url: result.secure_url
          }
          await fs.unlink(req.files.newImage.tempFilePath)
        } catch (error) {
          console.log(error);
        }
        
      }

      const reg = await Producto.findByIdAndUpdate({_id:id}, newData);
      
      res.status(200).send({data:reg});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const changeStatus = async function(req,res){
    if(req.user){
        var id = req.params['id'];
        var estado = req.params['estado'];

        try {
            await Producto.findByIdAndUpdate(
                {_id:id},
                {estado: estado === 'Publicado' ? 'Edicion' : 'Publicado'}
            );
            res.status(200).send({data:true});
        } catch (error) {
            res.status(200).send({data:undefined});
        }
        
     }else{
         res.status(500).send({message: 'NoAccess'});
     }
}

const addImage = async function(req,res){
    if(req.user && req.files?.imagen){
        let id = req.params['id'];
            let data = req.body;
            
            // var img_path = req.files.imagen.path;
            // var name = img_path.split('\\');
            // var imagen_name = name[2];
            const result = await uploadImage(req.files.imagen.tempFilePath)
            await fs.unlink(req.files.imagen.tempFilePath)
            
            let reg = await Producto.findByIdAndUpdate({_id:id},{ $push: {galeria:{
                name: req.files.imagen.name,
                public_id: result.public_id,
                secure_url: result.secure_url
            }}});

            res.status(200).send({data:reg});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const deleteImage = async function(req,res){
    if(req.user){
        let id = req.params['id'];
        let data = req.body;
      
        await removeImage(data._id)
        let reg = await Producto.findByIdAndUpdate({_id: id},{$pull: {galeria: {public_id: data._id}}});
        res.status(200).send({data:reg});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const updateVariedad = async function(req,res){
    if(req.user){
        let id = req.params['id'];
        let data = req.body;

        console.log(data.titulo_variedad);
        let reg = await Producto.findByIdAndUpdate({_id:id},{
            titulo_variedad: data.titulo_variedad,
        });
        res.status(200).send({data:reg});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

// Etiquetas del producto

const getEtiquetas = async function(req,res){
    if(req.user){
        var id = req.params['id'];
        var etiquetas = await ProductoEtiqueta.find({producto:id}).populate('etiqueta');
        res.status(200).send({data:etiquetas});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
} 

const deleteEtiqueta = async function(req,res){
    if(req.user){
        var id = req.params['id'];
        console.log(id);
        let reg = await ProductoEtiqueta.findByIdAndRemove({_id:id});
        res.status(200).send({data:reg});
        
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const addEtiqueta = async function(req,res){
    if(req.user){
        let data = req.body;

        var reg = await ProductoEtiqueta.create(data);
        res.status(200).send({data:reg});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const getInventario = async function(req,res){
    console.log('data');
    if(req.user){
        const data = await Inventario.find()
                                     .populate('variedad')
                                     .populate('producto');
                                     
        res.status(200).send({data});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const getInventarioByProduct = async function(req,res){
    // if(req.user){
        var id = req.params['id'];

        var reg = await Inventario.find({producto: id}).populate('variedad').sort({createdAt:-1});
        res.status(200).send({data:reg});
    // }else{
    //     res.status(500).send({message: 'NoAccess'});
    // }
}

const addInventario = async function(req,res){
    if(req.user){
        let data = req.body;

        let reg = await Inventario.create(data);

        //OBTENER EL REGISTRO DE PRODUCTO
        let prod = await Producto.findById({_id:reg.producto});
        let varie = await Variedad.findById({_id:reg.variedad});

        //CALCULAR EL NUEVO STOCK        
        //STOCK ACTUAL         
        //STOCK A AUMENTAR
        let nuevo_stock = parseInt(prod.stock) + parseInt(reg.cantidad);

        let nuevo_stock_vari = parseInt(varie.stock) + parseInt(reg.cantidad);

        //ACTUALICACION DEL NUEVO STOCK AL PRODUCTO
        let producto = await Producto.findByIdAndUpdate({_id:reg.producto},{
            stock: nuevo_stock
        });

        let variedad = await Variedad.findByIdAndUpdate({_id:reg.variedad},{
            stock: nuevo_stock_vari
        });

        res.status(200).send({data:reg});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

module.exports = {
  getPublicItems,
  getVariedades,
  getItemBySlug,
  getRecommendedItems,
  getFeaturedItems,
  getNewItems,
  getImgCover,

  getAllItems,
  addItem,
  getItem,
  getEtiquetas,
  deleteEtiqueta,
  addEtiqueta,
  updateItem,
  updateVariedad,
  addImage,
  deleteImage,
  changeStatus,

  getInventario,
  getInventarioByProduct,
  addInventario
}