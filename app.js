'use strict'
const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');

const { connectToDB } = require('./utils/mongoose.js');
const { PORT } = require('./config.js');

const app = express();

app.use(morgan('dev'))

connectToDB();
// const server = app.listen(PORT);
const server = app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});
// console.log("Server on port", PORT);

const io = require('socket.io')(server,{
    cors: {origin : '*'}
});

io.on('connection',function(socket){
    socket.on('delete-carrito',function(data){
        io.emit('new-carrito',data);
        console.log('New socket emition - delete: ',data);
    });


    socket.on('add-carrito-add',function(data){
        io.emit('new-carrito-add',data);
        console.log('New socket emition - add: ', data);
    });
    
});

// mongoose.connect('mongodb://127.0.0.1:27017/tienda',{useUnifiedTopology: true, useNewUrlParser: true}, (err,res)=>{
//     if(err){  
//         throw err;
//         console.log(err);
//     }else{
//         console.log("Corriendo....");
//         server.listen(port, function(){
//             console.log("Servidor " + port );
//         });

//     }
// });

app.use(bodyparser.urlencoded({limit: '50mb',extended:true}));
app.use(bodyparser.json({limit: '50mb', extended: true}));


app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*'); 
    res.header('Access-Control-Allow-Headers','Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods','GET, PUT, POST, DELETE, OPTIONS');
    res.header('Allow','GET, PUT, POST, DELETE, OPTIONS');
    next();
});

// Routes
app.use('/api', require('./routes'));

// export default app;