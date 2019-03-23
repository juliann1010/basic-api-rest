require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const app = express()

var bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.use(require('./routes/user'));

mongoose.connect(process.env.URLDB, {
    useCreateIndex: true, //These two parameters are used for avoiding deprecation warnings
    useNewUrlParser: true,
    useFindAndModify: false //This line avoid deprecation warning when updating
}, (err, res) =>{
   
    if (err) throw err;
 
    console.log("database connection succesful!")
});
 
app.listen(process.env.PORT, () =>{
    console.log("Escuchando por el puerto 3000");
})