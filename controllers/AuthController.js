const Admin = require('../models/Admin');
const Cliente = require('../models/Cliente');
const Carrito = require('../models/Carrito');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../helpers/jwt');

const register = async function(req,res){
    const data = req.body;
    const userFound  = await Cliente.findOne({email:data.email});

    if(userFound){
      return res.status(200).send({message:'El correo ya existe en la base de datos',data:undefined});
    }
    else if(!data.password){
        return res.status(200).send({message:'No hay una contraseña',data:undefined});
    }

    bcrypt.hash(data.password,null,null, async function(err,hash){
        if(!hash){
            return res.status(200).send({message:'ErrorServer',data:undefined});
        }

        data.dni = '';
        data.password = hash;
        const savedUser = await Cliente.create(data);
        res.status(200).send({data:savedUser});
    })
}

const login = async function(req,res){
    const data = req.body;
    const userFound  = await Cliente.findOne({email:data.email});

    if(!userFound){
        return res.status(200).send({message: 'No se encontro el correo', data: undefined});
    }

    bcrypt.compare(data.password, userFound.password, async function(error,check){
        if(!check){
            return res.status(200).send({message: 'La contraseña no coincide', data: undefined}); 
        }

        if(data.carrito.length >= 1){
            for(var item of data.carrito){
                await Carrito.create({
                    cantidad:item.cantidad,
                    producto:item.producto._id,
                    variedad:item.variedad.id,
                    cliente:userFound._id
                });
            }
        }

        res.status(200).send({
            data:userFound,
            token: jwt.createToken(userFound)
        });
    });
}

const verifyToken = async function(req,res){
    if(req.user){
        res.status(200).send({data:req.user});
    }else{
        res.status(500).send({message: 'NoAccess'});
    } 
}

const loginAdmin = async function(req,res){
    const data = req.body;
    const userFound  = await Admin.findOne({email:data.email});
    
    if(!userFound){
      return res.status(200).send({message: 'El correo electrónico no existe', data: undefined});
    }

    bcrypt.compare(data.password, userFound.password, async function(error,check){
      if(!check){
        return res.status(200).send({message: 'Las credenciales no coinciden', data: undefined});
      }

      res.status(200).send({
          data:userFound,
          token: jwt.createToken(userFound)
      });
    });
}

const registerAdmin = async function(req,res){
    const data = req.body;
    const userFound  = await Admin.findOne({email:data.email});


    if(userFound){
      return res.status(200).send({message:'El correo ya existe en la base de datos',data:undefined});
    } 
    else if(!data.password){
      return res.status(200).send({message:'No hay una contraseña',data:undefined});
    }
        
    bcrypt.hash(data.password,null,null, async function(err,hash){
        if(!hash){
            return res.status(200).send({message:'ErrorServer', data:undefined});
        }

        data.password = hash;
        const savedUser = await Admin.create(data);
        res.status(200).send({data:savedUser});
    })
}

module.exports = {
    login,
    register,
    loginAdmin,
    registerAdmin,
    verifyToken
}