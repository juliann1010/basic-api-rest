const express = require('express');
var User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

app.post('/login', (req,res)=>{
   
    let body = req.body;

    User.findOne({email: body.email}, (err, userFound)=>{
        
        if(err){
            return res.status(500).json({
                ok: false,
                message: "Internal error in database"
            })
        }

        if(!userFound){
            return res.status(400).json({
                ok: false,
                message: "Wrong email address"
            })
        }

        if(!bcrypt.compareSync(body.password, userFound.password)){
            return res.status(400).json({
                ok: false,
                message: "Wrong password"
            })
        } else{

            let token = jwt.sign({
                data: userFound
            }, process.env.SEED,
            { expiresIn: process.env.TOKEN_EXPIRATION_DATE}) //Expires in a month

            return res.json({
                ok: true,
                message: `Welcome ${userFound.name}`,
                token: token
            })
        }

    })
   
})



module.exports = app