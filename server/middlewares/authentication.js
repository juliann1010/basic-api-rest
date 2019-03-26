const jwt = require('jsonwebtoken');

//==============================
// Token verification
//==============================

let verifyToken = (req, res, next) =>{ //Params needed for a middleware

    let token = req.get('token'); //Receive token parameter from headers in http request

    jwt.verify(token, process.env.SEED, (err, decoded)=>{
        
        if(err){
            return res.status(401).json({
                ok: false,
                err
            })
        }
        req.user = decoded.data;
        next();
    })
}

//==============================
// Admin role verification
//==============================

let adminRoleVerify = (req, res, next) =>{
    
    let userRole = req.user.role;

    if(userRole != 'ADMIN_ROLE'){
        return res.status(401).json({
            ok: false,
            err: {
                message: "You have not permissions for doing this"
            }
        })
    }

    next();
}

module.exports ={
    verifyToken,
    adminRoleVerify
}