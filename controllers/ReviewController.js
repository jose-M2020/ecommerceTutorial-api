const Review = require('../models/Review');

const addItem  = async function(req,res){
    if(req.user){
        let data = req.body;
        let reg = await Review.create(data);
        res.status(200).send({data:reg});

    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const getItemsByProduct  = async function(req,res){
    let id = req.params['id'];
    let data = await Review.find({producto:id}).sort({createdAt:-1});
    res.status(200).send({data});
}

const  getItemsByProductWithClientInfo = async function(req,res){
    let id = req.params['id'];
    let data = await Review.find({producto:id}).populate('cliente').sort({createdAt:-1});
    res.status(200).send({data});
}

const getitemsByClient  = async function(req,res){
    if(req.user){
        let id = req.params['id'];
        let reg = await Review.find({cliente:id}).populate('cliente').populate('producto');
        res.status(200).send({data:reg});

    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

module.exports = {
  addItem,
  getItemsByProduct,
  getItemsByProductWithClientInfo,
  getitemsByClient
}

