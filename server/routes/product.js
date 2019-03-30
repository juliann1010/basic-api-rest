const express = require('express');
var Product = require('../models/product');
const _ = require('underscore');
const {verifyToken} = require('../middlewares/authentication');

const app = express();

app.get('/product', verifyToken, (req, res)=>{
    let from = req.query.from || 0;
    from = Number(from);

    let to = req.query.to || 0;
    to = Number(to);

    Product.find({available: true})
    .populate('user', 'name email')
    .populate('category', 'name')
    .skip(from) //Receives the number of the register where we want to start from
    .limit(to) //Receives the amount of registers we want to show
    .exec((err, products) =>{
        
        if(err){
            return res.status(500).json({
                ok: false,
                message: "Data for DB wasn't sent as expected",
                err
            });
        }

        Product.countDocuments({available: true}, (err, count)=>{
        
            return res.json({
                ok: true,
                products,
                total: count
            })
        })
    })
})

app.get('/product/:id', verifyToken, (req,res)=>{
    
    let id = req.params.id;
    
    Product.findById(id)
    .populate('user', 'name email')
    .populate('category', 'name')
    .exec((err, product)=>{
       
        if(err){
            return res.status(500).json({
                ok: false,
                message: "Data for DB wasn't sent as expected",
                err
            });
        }

        if(!product){
            return res.status(400).json({
                ok: false,
                message: "Product not found",
                err
            });
        }

        return res.json({
            ok: true,
            product
        })
    })
})
//Busqueda con expresiones regulares
app.get('/product/search/:term', verifyToken, (req, res)=>{
    
    let term = req.params.term;

    let regex = new RegExp(term, 'i');

    Product.find({name: regex})
    .populate('user', 'name email')
    .populate('category', 'name')
    .exec((err, products) =>{
        
        if(err){
            return res.status(500).json({
                ok: false,
                message: "Data for DB wasn't sent as expected",
                err
            });
        }

        Product.countDocuments({available: true}, (err, count)=>{
        
            return res.json({
                ok: true,
                products,
                total: count
            })
        })
    })
})

app.post('/product', verifyToken, (req,res)=>{
    
    let body = req.body;

    let product = new Product({
        name: body.name,
        price: body.price,
        description: body.description,
        category: body.category,
        user: req.user._id
    })

    product.save((err, productStored)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                message: "Data for DB wasn't sent as expected",
                err
            });
        }
 
        if(!productStored){
            return res.status(400).json({
                message: "Couldn't save document in the DB"
            });
        }
 
        return res.status(200).json({productStored});
    })
})

app.put('/product/:id', verifyToken, (req, res)=>{

    let id = req.params.id;
    let body = _.pick(req.body,['name', 'price', 'description', 'category', 'user']);

    Product.findByIdAndUpdate(id, body, {new: true, runValidators: true, context: 'query'}, (err, updatedProduct)=>{
        
        if(err){
            return res.status(500).json({
                ok: false,
                message: "Data for DB wasn't sent as expected",
                err
            });
        }

        if(!updatedProduct){
            return res.status(400).json({
                ok: false,
                message: "Couldn't find project with sent ID"
            });
        }

        return res.json({
            updatedProduct
        })
    })
})

app.delete('/product/:id', verifyToken, function (req, res) {
      
    var id= req.params.id;
    let body = {
        available: false
    }

    Product.findByIdAndUpdate(id, body, {new: true}, (err,updatedProduct)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                message: "Data for DB wasn't sent as expected",
                err
            });
        }

        if(!updatedProduct){
            return res.status(400).json({
                ok: false,
                message: "Couldn't find project with sent ID"
            });
        }

        return res.json({
            updatedProduct
        })
    });
})

module.exports = app;