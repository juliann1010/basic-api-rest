require('./config/config');
const express = require('express')
const app = express()

var bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
 
app.get('/users', function (req, res) {
  res.json('Get World')
})

app.post('/users', function (req, res) {
    var name = req.body.name;
    var color = req.body.color;

    if(!name){
        res.status(400).json({
            ok: false,
            message: "name is necessary"
        })
    } else{
        res.status(200).json({
            name,
            color
        })
    }
})

app.put('/users/:id', function (req, res) {
    var id = req.params.id;

    if(!id){
        res.status(500).json({
            ok: false,
            message: "Something just happened"
        }) 
    } else{
        res.status(200).json({
            id
        })
    }
})

app.delete('/users', function (req, res) {
    res.json('Delete World')
})
 
app.listen(process.env.PORT, () =>{
    console.log("Escuchando por el puerto 3000");
})