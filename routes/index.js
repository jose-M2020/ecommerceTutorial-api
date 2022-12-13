const express = require('express');
const router = express.Router();
const fs = require('fs');
const routesPath = `${__dirname}/`;
const { removeFileExtension } = require('../helpers/utils');

router.use('/', require('./auth'));

// Establecer cada archivo de la carpeta routes como una ruta excepto index y auth
fs.readdirSync(routesPath).filter( file => {
  const fileName = removeFileExtension(file);
  
  return fileName !== 'index' && fileName !== 'auth'
    ? router.use(`/${fileName}`, require(`./${fileName}`))
    : ''
})

// router.get('/', (req, res) => {
//   res.render('index')
// })

router.use('*', (req, res) => {
  res.status(404).json({
    errors: {
      msg: 'URL_NOT_FOUND'
    }
  })
})

module.exports = router
