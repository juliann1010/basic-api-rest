const express = require('express');
var User = require('../models/users');
const bcrypt = require('bcrypt');
const _ = require('underscore');


const app = express()

app.get('/users', function (req, res) {
    
    let from = req.query.from || 0;
    from = Number(from);

    let to = req.query.to || 0;
    to = Number(to);

    User.find({status: true})
    .skip(from) //Receives the number of the register where we want to start from
    .limit(to) //Receives the amount of registers we want to show
    .exec((err, users) =>{
        
        if(err){
            return res.status(500).json({
                 ok: false,
                 message: "Data for DB wasn't sent as expected",
                 err
             });
         }

         User.countDocuments({status: true}, (err, count)=>{
            
            return res.json({
                ok: true,
                users,
                total: count
            })

         })

         
    })

  })
  
  app.post('/users', function (req, res) {
      
    var body = req.body;
        
    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })

    user.save((err, userStored)=>{
        if(err){
           return res.status(500).json({
                ok: false,
                message: "Data for DB wasn't sent as expected",
                err
            });
        }

        if(!userStored){
           return res.status(400).json({
                message: "Couldn't save document in the DB"
            });
        }

        return res.status(200).json({userStored});
        
    })

  })
  
  app.put('/users/:id', function (req, res) {
      var id = req.params.id;
      let body = _.pick(req.body,['name', 'email', 'img', 'role', 'status']) ;

      User.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, updatedUser)=>{
        
        if(err){
            return res.status(500).json({
                 ok: false,
                 message: "Data for DB wasn't sent as expected",
                 err
             });
         }

         if(!updatedUser){
             return res.status(400).json({
                 ok: false,
                 message: "Couldn't find project with sent ID"
             });
         }

         return res.json({
             updatedUser
         })

      })
  
  })
  
  app.delete('/users/:id', function (req, res) {
      
    var id= req.params.id;
    let body = {
        status: false
    }

    User.findByIdAndUpdate(id, body, {new: true}, (err,updatedUser)=>{
        if(err){
            return res.status(500).json({
                 ok: false,
                 message: "Data for DB wasn't sent as expected",
                 err
             });
         }

         if(!updatedUser){
             return res.status(400).json({
                 ok: false,
                 message: "Couldn't find project with sent ID"
             });
         }

         return res.json({
             updatedUser
         })
    });
  })

  module.exports = app
  