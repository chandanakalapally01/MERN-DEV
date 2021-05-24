const express = require('express')
const bcrypt = require('bcryptjs')
const {check, validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const config = require('config')

const router = express.Router()

const User = require('../../models/User')

// @desc   Register user
// @acc    Public 
router.post("/",
    check("name","Name is required").notEmpty(),
    check("email","Please enter a valid email id").isEmail(),
    check("password","Please enter a valid password").isLength({min: 6}),
    async (req, res) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            res.status(400).json({errors: errors.array()})
        }

        const {name, email, password} = req.body
        let user = await User.findOne({ email });
        if(user){
            return res.status(400).json({errors: [{"msg":"User already exists! Please Login"}]})
        }
        user = new User({
          name: name,
          email: email, 
          password: password
        });

        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(password, salt)

        await user.save()

        const payload = {
            user: {
              id: user.id
            }
          };
    
          jwt.sign(
            payload,
            config.get('jwtSecret'),
            { expiresIn: '5 days' },
            (err, token) => {
              if (err) throw err;
              res.json({ token });
            }
          );

    }
);

module.exports =  router