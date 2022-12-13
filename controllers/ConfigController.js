const Config = require('../models/Config');

const getConfig = async (req,res)=>{
    let config = await Config.findById({_id:'639727cc3535389ed7beec58'});
    res.status(200).send({data:config});
}

const updateConfig = async (req,res)=>{
    if(req.user){
        let data = req.body;
        let config = await Config.findByIdAndUpdate({_id:'639727cc3535389ed7beec58'},{
            envio_activacion : data.envio_activacion,
            monto_min_mexicanos: data.monto_min_mexicanos,
            monto_min_dolares : data.monto_min_dolares
        });
        res.status(200).send({data:config});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
    
}

module.exports = {
    getConfig,
    updateConfig
}