var Cliente = require('../models/Cliente');
var bcrypt = require('bcrypt-nodejs');

var fs = require('fs');
var handlebars = require('handlebars');
var ejs = require('ejs');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

registro_cliente_tienda = async function(req,res){
    let data = req.body;
    var clientes_arr = [];

    clientes_arr = await Cliente.find({email:data.email});

    if(clientes_arr.length == 0){
        if(data.password){
            bcrypt.hash(data.password,null,null, async function(err,hash){
                if(hash){
                    data.dni = '';
                    data.password = hash;
                    var reg = await Cliente.create(data);
                    res.status(200).send({data:reg});
                }else{
                    res.status(200).send({message:'ErrorServer',data:undefined});
                }
            })
        }else{
            res.status(200).send({message:'No hay una contraseña',data:undefined});
        }

        
    }else{
        res.status(200).send({message:'El correo ya existe, intente con otro.',data:undefined});
    }
}

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

// -------------------------------------------


// -------------------------------------------


//---METODOS PUBLICOS----------------------------------------------------

// -------------------------------------------


// -------------------------------------------


// VENTAS
// -------------------------------------------


// -------------------------------------------

// -------------------------------------------

// SEND EMAILS
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
                user: 'diegoalonssoac@gmail.com',
                pass: 'dcmplvjviofjojgf'
            }
        }));
    
     
        var orden = await Venta.findById({_id:venta}).populate('cliente').populate('direccion');
        var dventa = await Dventa.find({venta:venta}).populate('producto').populate('variedad');
    
    
        readHTMLFile(process.cwd() + '/mails/email_pedido.html', (err, html)=>{
                                
            let rest_html = ejs.render(html, {orden: orden, dventa:dventa});
    
            var template = handlebars.compile(rest_html);
            var htmlToSend = template({op:true});
    
            var mailOptions = {
                from: 'diegoalonssoac@gmail.com',
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


module.exports = {
  getItem,
  getItems,
  updateItem,
}