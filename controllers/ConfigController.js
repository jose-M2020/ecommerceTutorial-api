const fs = require('fs-extra');

const Config = require('../models/Config');
const { removeImage, uploadImage } = require('../utils/cloudinary');

const getConfig = async (req,res)=>{
    let config = await Config.findById({_id:'639727cc3535389ed7beec58'});
    res.status(200).send({data:config});
}

const updateConfig = async (req,res)=>{
    if(req.user){
        let data = req.body;
        data.envio = JSON.parse(data?.envio);
        data.categorias = JSON.parse(data?.categorias);
        data.logo = JSON.parse(data?.logo);
        
        if(req?.files) {
            try {
              await removeImage(data?.logo?.public_id);
              const result = await uploadImage(req.files.file.tempFilePath)
              
              data.logo = {
                  name: req.files.file.name,
                  public_id: result.public_id,
                  secure_url: result.secure_url
              }

              await fs.unlink(req.files.file.tempFilePath)  
            } catch (error) {
              console.log(error);
            }
        }
        
        const config = await Config.findByIdAndUpdate({_id:'639727cc3535389ed7beec58'}, data);
        res.status(200).send({data:config});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
    
}

module.exports = {
    getConfig,
    updateConfig
}