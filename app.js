const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/order');
// app.use((request,response, next)=>{
//     response.status(200).json({
//         message:'It works!'
//     })
// })//middleware

//mongoose
mongoose.connect('mongodb+srv://geethapriya8kb:nancy@8kb@cluster0.thmvn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

app.use(morgan('dev'));//gives logs like which request and time it took to execute
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//To avoid CORS error
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers',
        "Origin, X-Requested-with, Content-Type,Accept,Authorization");
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST,PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
})


//routes which should handle requests
app.use('/products', productRoutes);
app.use('/order', orderRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});
module.exports = app;