const express = require('express');
var Category = require('../models/categories');
const _ = require('underscore');
const {verifyToken, adminRoleVerify} = require('../middlewares/authentication');

const app = express();

app.get('/category', verifyToken, (req, res)=>{

    Category.find({})
    .populate('user', 'name email')
    .exec((err, categories)=>{
       
        if(err){
            return res.status(500).json({
                 ok: false,
                 message: "Data for DB wasn't sent as expected",
                 err
             });
        }

        Category.countDocuments({}, (err, count)=>{
             return res.json({
                 ok: true,
                 total: count,
                 categories
             })
        })
    })
})

app.get('/category/:id', verifyToken, (req, res)=>{
    
    let id = req.params.id;
    
    Category.findById(id, (err, categories)=>{
       
        if(err){
            return res.status(500).json({
                 ok: false,
                 message: "Data for DB wasn't sent as expected",
                 err
             });
        }

        return res.json({
            ok: true,
            categories
        })
    })
})

app.post('/category', verifyToken, (req,res)=>{

    let body = req.body;

    let category = new Category({
        name: body.name,
        user: req.user._id //Comes from verify token
    })

    category.save((err, categoryStored)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                message: "Data for DB wasn't sent as expected",
                err
            });
        }
 
        if(!categoryStored){
            return res.status(400).json({
                message: "Couldn't save document in the DB"
            });
        }
 
        return res.status(200).json({categoryStored});
    })
})

app.put('/category/:id', verifyToken, (req,res)=>{

    let id = req.params.id;
    let body = _.pick(req.body,['name']);

    Category.findByIdAndUpdate(id, body, {new: true, runValidators: true, context: 'query'}, (err, updatedCategory)=>{
        
        if(err){
            return res.status(500).json({
                ok: false,
                message: "Data for DB wasn't sent as expected",
                err
            });
        }

        if(!updatedCategory){
            return res.status(400).json({
                ok: false,
                message: "Couldn't find project with sent ID"
            });
        }

        return res.json({
            updatedCategory
        })
    })
})

app.delete('/category/:id', [verifyToken, adminRoleVerify], (req, res)=>{
    let id = req.params.id;

    Category.findByIdAndRemove(id, (err, removedCategory)=>{

        if(err){
            return res.status(500).json({
                ok: false,
                message: "Data for DB wasn't sent as expected",
                err
            });
        }

        if(!removedCategory){
            return res.status(400).json({
                ok: false,
                message: "Can't find category",
                err
            });
        }

        return res.json({
            ok: true,
            message: "Category succesfully deleted"
        })
    })
})

module.exports = app;