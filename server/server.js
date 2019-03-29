require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path'); //Used for resolving path for static content
const app = express();

var bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

// Use static content from public folder
app.use(express.static(path.resolve(__dirname, '../public')))


app.use(require('./routes/index'));

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