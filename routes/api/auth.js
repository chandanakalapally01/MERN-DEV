const express = require('express')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator');

const router = express.Router()

const User = require('../../models/User')

const auth = require('../../middleware/auth');

// @desc get user by token
// @acc  Private
router.get("/",auth, async (req, res)=>{
    try{
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    }
    catch(err){
        res.status(500).json({msg: "Some error has occured"})
    }
})

// @desc login
// @acc public
router.post("/", 
    check("email","Please enter a valid email").isEmail(), 
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(406).json({errors: errors.array()});
        }
        const {email, password} = req.body;
        let user = await User.findOne({email: email})
        if(!user){
            return res.status(406).json({msg: "Incorrect email id"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(406).json({msg: "Incorrect password"});
        }

        const payload = {
            user:{
                id: user.id
            }
        }

        jwt.sign(payload, config.get('jwtSecret'), {expiresIn: 360000}, (err, token) => {
            res.json({token});
        })

    }
);

module.exports = router
