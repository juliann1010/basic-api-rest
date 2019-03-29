const express = require('express');
var User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    
    return {
        email: payload.email,
        name: payload.name,
        img: payload.picture,
        google: true
    }
  }
  

app.post('/google', async (req,res)=>{
    
    let token = req.body.idtoken

    let googleUser = await verify(token)
                        .catch(err =>{
                            return res.status(403).json({
                                ok: false,
                                err
                            });
                        });
        
        //Validations
        //We have to check if email exists in DB 
        
        User.findOne({email: googleUser.email}, (err, userFound)=>{
            
            if(err){
                return res.status(500).json({
                    ok: false,
                    message: "Internal error in database"
                })
            }
            
            if(userFound){ 
                
                //If email exists in DB we have to check if it was created with normal login or not
                if(userFound.google === false){
                    
                    return res.status(400).json({
                    ok: false,
                    message: "Please access with normal login"
                })
            } else {
                //In case it was created by google, then we assing a new token to the user
                let token = jwt.sign({
                    data: userFound
                }, process.env.SEED,
                { expiresIn: process.env.TOKEN_EXPIRATION_DATE}) //Expires in a month
    
                return res.json({
                    ok: true,
                    message: `Welcome ${userFound.name}`,
                    token: token
                })
            }}

            else{
                //In case of email doesn't exist, we create a new user in DB with google credentials
                let user = new User({
                    name: googleUser.name,
                    email: googleUser.email,
                    password: ':)',
                    img: googleUser.img,
                    google: googleUser.google
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
            }
        })
})



module.exports = app