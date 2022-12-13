const Venta = require('../models/Venta');
const Dventa = require('../models/Dventa');
const Producto = require('../models/Producto');
const Variedad = require('../models/Variedad');
const Carrito = require('../models/Carrito');

const fs = require('fs');
const handlebars = require('handlebars');
const ejs = require('ejs');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

const getItemsByClient  = async function(req,res){
    if(req.user){
        const id = req.params['id'];
        const data = await Venta.find({cliente:id}).sort({createdAt:-1});
        res.status(200).send({data});   
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const getItemDetails  = async function(req,res){
    if(req.user){
        const id = req.params['id'];
        
        try {
            let venta = await Venta.findById({_id:id}).populate('direccion').populate('cliente');
            let detalles = await Dventa.find({venta:venta._id}).populate('producto').populate('variedad');
            res.status(200).send({data:venta,detalles:detalles});

        } catch (error) {
            console.log(error);
            res.status(200).send({data:undefined});
        }
            
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const addItem = async function(req,res){
    if(req.user){

        var data = req.body;
        var detalles = data.detalles;

        data.estado = 'Procesando';

        let venta = await Venta.create(data);

        for(var element of detalles){
            element.venta = venta._id;
            await Dventa.create(element);

            let element_producto = await Producto.findById({_id:element.producto});
            let new_stock = element_producto.stock - element.cantidad;
            let new_ventas = element_producto.nventas + 1;

            let element_variedad = await Variedad.findById({_id:element.variedad});
            let new_stock_variedad = element_variedad.stock - element.cantidad;

            await Producto.findByIdAndUpdate({_id: element.producto},{
                stock: new_stock,
                nventas: new_ventas
            });

            await Variedad.findByIdAndUpdate({_id: element.variedad},{
                stock: new_stock_variedad,
            });

            //limpiar carrito
            await Carrito.deleteMany({cliente:data.cliente});
        }

        enviar_orden_compra(venta._id);

        res.status(200).send({data:venta});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const consultarIDPago = async function(req,res){
    if(req.user){
        var id = req.params['id'];
        var ventas = await Venta.find({transaccion:id});
        res.status(200).send({data:ventas});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

// const enviar_orden_compra = async function(venta){
//     try {
//         var readHTMLFile = function(path, callback) {
//             fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
//                 if (err) {
//                     throw err;
//                     callback(err);
//                 }
//                 else {
//                     callback(null, html);
//                 }
//             });
//         };
    
//         var transporter = nodemailer.createTransport(smtpTransport({
//             service: 'gmail',
//             host: 'smtp.gmail.com',
//             auth: {
//                 user: 'mextech.business@gmail.com',
//                 pass: '8sep2000'
//             }
//         }));
    
     
//         var orden = await Venta.findById({_id:venta}).populate('cliente').populate('direccion');
//         var dventa = await Dventa.find({venta:venta}).populate('producto').populate('variedad');
    
    
//         readHTMLFile(process.cwd() + '/mails/email_compra.html', (err, html)=>{
                                
//             let rest_html = ejs.render(html, {orden: orden, dventa:dventa});
    
//             var template = handlebars.compile(rest_html);
//             var htmlToSend = template({op:true});
    
//             var mailOptions = {
//                 from: 'mextech.business@gmail.com',
//                 to: orden.cliente.email,
//                 subject: 'Confirmación de compra ' + orden._id,
//                 html: htmlToSend
//             };
          
//             transporter.sendMail(mailOptions, function(error, info){
//                 if (!error) {
//                     console.log('Email sent: ' + info.response);
//                 }
//             });
        
//         });
//     } catch (error) {
//         console.log(error);
//     }
// } 

const newOrder = async function(req,res){
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
                data.estado = 'En espera';
                let venta = await Venta.create(data);
        
                for(var element of detalles){
                    element.venta = venta._id;
                    await Dventa.create(element);
                    await Carrito.deleteMany({cliente:data.cliente});
                }
                enviar_email_pedido_compra(venta._id);
                res.status(200).send({venta:venta});
            }else{
                res.status(200).send({venta:undefined,message:'Stock insuficiente para ' + producto_sl});
            }
        } catch (error) {
            console.log(error);
        }

        
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const getItems  = async function(req,res){
    if(req.user){
        let ventas = [];
            let desde = req.params['desde'];
            let hasta = req.params['hasta'];

            ventas = await Venta.find().populate('cliente').populate('direccion').sort({createdAt:-1});
            res.status(200).send({data:ventas});

            
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const getItem  = async function(req,res){
    if(req.user){
        var id = req.params['id'];

        try {
            let venta = await Venta.findById({_id:id}).populate('direccion').populate('cliente');
            let detalles = await Dventa.find({venta:venta._id}).populate('producto').populate('variedad');
            res.status(200).send({data:venta,detalles:detalles});

        } catch (error) {
            console.log(error);
            res.status(200).send({data:undefined});
        }
        
        
        
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const setFinished = async function(req,res){
    if(req.user){

        var id = req.params['id'];
        let data = req.body;

        var venta = await Venta.findByIdAndUpdate({_id:id},{
            estado: 'Finalizado'
        });

        res.status(200).send({data:venta});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const deleteItem = async function(req,res){
    if(req.user){

        var id = req.params['id'];

        var venta = await Venta.findOneAndRemove({_id:id});
        await Dventa.deleteMany({venta:id});

        res.status(200).send({data:venta});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const setShipped = async function(req,res){
    if(req.user){

        var id = req.params['id'];
        let data = req.body;

        var venta = await Venta.findByIdAndUpdate({_id:id},{
            tracking: data.tracking,
            estado: 'Enviado'
        });

        mail_confirmar_envio(id);

        res.status(200).send({data:venta});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const confirmPayment = async function(req,res){
    if(req.user){

        var id = req.params['id'];
        let data = req.body;

        var venta = await Venta.findByIdAndUpdate({_id:id},{
            estado: 'Procesando'
        });

        var detalles = await Dventa.find({venta:id});
        for(var element of detalles){
            let element_producto = await Producto.findById({_id:element.producto});
            let new_stock = element_producto.stock - element.cantidad;
            let new_ventas = element_producto.nventas + 1;

            let element_variedad = await Variedad.findById({_id:element.variedad});
            let new_stock_variedad = element_variedad.stock - element.cantidad;

            await Producto.findByIdAndUpdate({_id: element.producto},{
                stock: new_stock,
                nventas: new_ventas
            });

            await Variedad.findByIdAndUpdate({_id: element.variedad},{
                stock: new_stock_variedad,
            });
        }

        res.status(200).send({data:venta});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const addItemManual = async function(req,res){
    if(req.user){

        var data = req.body;
        var detalles = data.detalles;

        data.estado = 'Procesando';
        
        console.log(data);

        let venta = await Venta.create(data);

        for(var element of detalles){
            element.venta = venta._id;
            element.cliente = venta.cliente;
            await Dventa.create(element);

            let element_producto = await Producto.findById({_id:element.producto});
            let new_stock = element_producto.stock - element.cantidad;
            let new_ventas = element_producto.nventas + 1;

            let element_variedad = await Variedad.findById({_id:element.variedad});
            let new_stock_variedad = element_variedad.stock - element.cantidad;

            await Producto.findByIdAndUpdate({_id: element.producto},{
                stock: new_stock,
                nventas: new_ventas
            });

            await Variedad.findByIdAndUpdate({_id: element.variedad},{
                stock: new_stock_variedad,
            });
        }

        enviar_orden_compra(venta._id);

        res.status(200).send({venta:venta});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

// KPI
// -------------------------------------------
// TODO: Factorize code for the request of charts

const kpi = async function(req,res){
    if(req.user){
      const data = req.body;
      const monthsProfit = {
        enero: 0,
        febrero: 0,
        marzo: 0,
        abril: 0,
        mayo: 0,
        junio: 0,
        julio: 0,
        agosto: 0,
        septiembre: 0,
        octubre: 0,
        noviembre: 0,
        diciembre: 0,
      }
      const namesMonths = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']

      let total_ganancia = 0;
      let total_mes = 0;
      let count_ventas = 0;
      let total_mes_anterior = 0;
      const salesStatus = await getSalesStatus(data);
      
      const reg = await Venta.find();

      let current_date = new Date();
      let current_year = current_date.getFullYear();
      let current_month = current_date.getMonth();

      for(var item of reg){
        let createdAt_date = new Date(item.createdAt);
        let mes = createdAt_date.getMonth();
        let monthName = namesMonths[mes];

        if(createdAt_date.getFullYear() == current_year){

          total_ganancia = total_ganancia + item.subtotal;

          if(mes == current_month){
              total_mes = total_mes + item.subtotal;
              count_ventas = count_ventas + 1;
          }

          if(mes == current_month -1 ){
              total_mes_anterior = total_mes_anterior + item.subtotal;
          }

          monthsProfit[monthName]+= item.subtotal;
        }
      }

      res.status(200).send({
          profit:{
            ...monthsProfit
          },
          total_ganancia:total_ganancia,
          total_mes: total_mes,
          count_ventas:count_ventas,
          total_mes_anterior: total_mes_anterior,
          salesStatus
      })
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const getStoreDetails = async () => {
    
}

const getSalesPerYear = async (sales, namesMonths) => {
    const monthsProfit = {
      enero: 0,
      febrero: 0,
      marzo: 0,
      abril: 0,
      mayo: 0,
      junio: 0,
      julio: 0,
      agosto: 0,
      septiembre: 0,
      octubre: 0,
      noviembre: 0,
      diciembre: 0,
    }

    for(var item of sales){
      let createdAt_date = new Date(item.createdAt);
      let mes = createdAt_date.getMonth();
      let monthName = namesMonths[mes];

      if(createdAt_date.getFullYear() == current_year){

        total_ganancia = total_ganancia + item.subtotal;

        if(mes == current_month){
            total_mes = total_mes + item.subtotal;
            count_ventas = count_ventas + 1;
        }

        if(mes == current_month -1 ){
            total_mes_anterior = total_mes_anterior + item.subtotal;
        }

        monthsProfit[monthName]+= item.subtotal;
      }
    }
}

const getSalesStatus = async (data) => {
    if(data.profitRange){
      salesStatus = await Venta.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(data.profitRange[0]),
              $lt: new Date(data.profitRange[1])
            }   
          }
        },
        {
          $group: {
              _id: { estado: '$estado'}, 
              count: {$sum: 1}
          }
        }
      ])

      return salesStatus;
    }
}

const getbestSellingProducts = async () => {
    
}

// TODO: Verify if the email is sent correctly

// SEND EMAIL
// -------------------------------------------

const enviar_email_pedido_compra = async function(venta){
    try {
        var readHTMLFile = function(path, callback) {
            fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
                if (err) {
                    throw err;
                    callback(err);
                }
                else {
                    callback(null, html);
                }
            });
        };
    
        var transporter = nodemailer.createTransport(smtpTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            auth: {
                user: 'mextech.business@gmail.com',
                pass: '8sep2000'
            }
        }));
    
     
        var orden = await Venta.findById({_id:venta}).populate('cliente').populate('direccion');
        var dventa = await Dventa.find({venta:venta}).populate('producto').populate('variedad');
    
    
        readHTMLFile(process.cwd() + '/mails/email_pedido.html', (err, html)=>{
                                
            let rest_html = ejs.render(html, {orden: orden, dventa:dventa});
    
            var template = handlebars.compile(rest_html);
            var htmlToSend = template({op:true});
    
            var mailOptions = {
                from: 'mextech.business@gmail.com',
                to: orden.cliente.email,
                subject: 'Gracias por tu orden, Prágol.',
                html: htmlToSend
            };
          
            transporter.sendMail(mailOptions, function(error, info){
                if (!error) {
                    console.log('Email sent: ' + info.response);
                }
            });
        
        });
    } catch (error) {
        console.log(error);
    }
} 

const mail_confirmar_envio = async function(venta){
    try {
        var readHTMLFile = function(path, callback) {
            fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
                if (err) {
                    throw err;
                    callback(err);
                }
                else {
                    callback(null, html);
                }
            });
        };
    
        var transporter = nodemailer.createTransport(smtpTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            auth: {
                user: 'mextech.business@gmail.com',
                pass: '8sep2000'
            }
        }));
    
     
        var orden = await Venta.findById({_id:venta}).populate('cliente').populate('direccion');
        var dventa = await Dventa.find({venta:venta}).populate('producto').populate('variedad');
    
    
        readHTMLFile(process.cwd() + '/mails/email_enviado.html', (err, html)=>{
                                
            let rest_html = ejs.render(html, {orden: orden, dventa:dventa});
    
            var template = handlebars.compile(rest_html);
            var htmlToSend = template({op:true});
    
            var mailOptions = {
                from: 'mextech.business@gmail.com',
                to: orden.cliente.email,
                subject: 'Tu pedido ' + orden._id + ' fué enviado',
                html: htmlToSend
            };
          
            transporter.sendMail(mailOptions, function(error, info){
                if (!error) {
                    console.log('Email sent: ' + info.response);
                }
            });
        
        });
    } catch (error) {
        console.log(error);
    }
}

const enviar_orden_compra = async function(venta){
    try {
        var readHTMLFile = function(path, callback) {
            fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
                if (err) {
                    throw err;
                    callback(err);
                }
                else {
                    callback(null, html);
                }
            });
        };
    
        var transporter = nodemailer.createTransport(smtpTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            auth: {
                user: 'mextech.business@gmail.com',
                pass: '8sep2000'
            }
        }));
    
     
        var orden = await Venta.findById({_id:venta}).populate('cliente').populate('direccion');
        var dventa = await Dventa.find({venta:venta}).populate('producto').populate('variedad');
    
    
        readHTMLFile(process.cwd() + '/mails/email_compra.html', (err, html)=>{
                                
            let rest_html = ejs.render(html, {orden: orden, dventa:dventa});
    
            var template = handlebars.compile(rest_html);
            var htmlToSend = template({op:true});
    
            var mailOptions = {
                from: 'mextech.business@gmail.com',
                to: orden.cliente.email,
                subject: 'Confirmación de compra ' + orden._id,
                html: htmlToSend
            };
          
            transporter.sendMail(mailOptions, function(error, info){
                if (!error) {
                    console.log('Email sent: ' + info.response);
                }
            });
        
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
  getItemsByClient,
  getItemDetails,
  consultarIDPago,
  addItem,

  newOrder,
  getItems,
  getItem,
  setFinished,
  deleteItem,
  setShipped,
  confirmPayment,
  addItemManual,
  kpi
}