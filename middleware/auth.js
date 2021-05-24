const config = require('config')
const jwt = require('jsonwebtoken')

module.exports = function(req, res, next){
    const token = req.header("x-auth-token")
    if(!token){
        return res.status(401).json({msg:"No token available"})
    }
    try{
        jwt.verify(token, config.get('jwtSecret'), (err, dec)=>{
            if(err){
                return res.status(401).json({msg:"Invalid token"})
            }
            else{
                req.user = dec.user;
                next();
            }
        });
    }catch(err){
        return res.status(402).json({msg: "Some error has occured"})
    }
}
