const express = require('express');
const router = express.Router();

const Profile = require('../../models/Profile')
const User = require('../../models/User');
const auth = require('../../middleware/auth');
const { check,validationResult } = require('express-validator/check');

//@desc get user profile
//@acc private 
router.get("/me", 
    auth,
    async (req, res) => {
        try{
            let profile = await Profile.findOne({user: req.user.id}).populate('user', ['name'])
            if(!profile){
                res.status(500).json({msg: "Invalid login"});
            }
            res.json(profile)
        }catch(err){
            res.status(500).json({msg: "Some error has occured"});
        }
    }
)

//@add or update profile
//@acc only user that's logged in 
router.post("/",auth, 
        check("status","Status can't be empty").notEmpty(),
        check("skills", "Skills can't be empty").notEmpty(),
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(500).json({errors: errors.array()});
        }
        const {
            company, 
            website,
            location,
            status,
            skills,
            bio, 
            githubusername,
            youtube,
            facebook, 
            twitter,
            instagram,
            linkedin
        } = req.body;

        // build profile object
        const profileField = {}
        profileField.user = req.user.id
        if(company) profileField.company =company
        if(website) profileField.website = website
        if(location) profileField.location = location
        if(status) profileField.status = status
        if(bio) profileField.bio = bio
        if(githubusername) profileField.githubusername = githubusername
        if(skills) profileField.skills = skills.split(",").map(skill => skill.trim())
        profileField.social = {}
        if(youtube) profileField.social.youtube = youtube
        if(linkedin) profileField.social.linkedin = linkedin
        if(twitter) profileField.social.twitter = twitter
        if(facebook) profileField.social.facebook = facebook
        if(instagram) profileField.social.instagram = instagram
        try{

            let profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileField },
                { new: true, upsert: true, setDefaultsOnInsert: true }
              );
              return res.json(profile);

        }catch(err){
            console.log("Error");
            res.status(500).send("Error in the server")
        }
    }
)

//@desc  Get all profiles
//@acc   Public
router.get("/", async (req, res) => {
    try{
        const profiles = await Profile.find().populate("user",["name"])
        res.json(profiles);
    }catch(err){
        console.log("In profile, all profiles")
        res.status(500).send("Server error");
    }
})

//@desc get profile by id
//@acc Public
router.get("/user/:user_id", async (req, res) => {
    try{
        const profile = await Profile.findOne({user: req.params.user_id}).populate("user",["name"])
        if(!profile){
            res.status(600).json({msg: "Profile doesnt exist"})
        }
        res.json(profile);
    }catch(err){
        console.log("In profile, all profiles")
        res.status(500).send("Server error");
    }
})

//@desc DELETE Profile and user
//@acc private
router.delete("/", auth, async (req, res) => {
    try{
        await Profile.findOneAndRemove({user: req.user.id})
        await User.findOneAndRemove({_id: req.user.id})
        res.json("User deleted")
    }catch(err){
        console.log("Server error");
    }
})

//@desc Add the experienec
//@acc Private
router.put(
    '/experience',
    auth,
    check('title', 'Title is required').notEmpty(),
    check('company', 'Company is required').notEmpty(),
    check('from', 'From date is required and needs to be from the past')
      .notEmpty()
      .custom((value, { req }) => (req.body.to ? value < req.body.to : true)),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      try {
        const profile = await Profile.findOne({ user: req.user.id });
  
        profile.experience.unshift(req.body);
  
        await profile.save();
  
        res.json(profile);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    }
 );

 //@desc delete exp by id
 //@acc private

router.delete("/experience/:exp_id",auth,
    async (req, res) => {
        try{
            const profile = await Profile.findOne({user: req.user.id});
            const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id)
            profile.experience.splice(removeIndex, 1);
            await profile.save()
            res.json(profile)
        }catch(err){
            console.log("Some mistake in the delete");
        }
    }
)

//@desc Add the experienec
//@acc Private
router.put(
    '/education',
    auth,
    check('school', 'Title is required').notEmpty(),
    check('degree', 'Company is required').notEmpty(),
    check('fieldofstudy', 'Field od study is required'),
    check('from', 'From date is required and needs to be from the past')
      .notEmpty()
      .custom((value, { req }) => (req.body.to ? value < req.body.to : true)),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      try {
        const profile = await Profile.findOne({ user: req.user.id });
        profile.education.unshift(req.body);
  
        await profile.save();
  
        res.json(profile);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    }
 );


 //@desc DELETE Profile and user
//@acc private
router.delete("/", auth, async (req, res) => {
    try{
        await Profile.findOneAndRemove({user: req.user.id})
        await User.findOneAndRemove({_id: req.user.id})
        res.json("User deleted")
    }catch(err){
        console.log("Server error");
    }
})

//@desc Add the experienec
//@acc Private
router.put(
    '/experience',
    auth,
    check('title', 'Title is required').notEmpty(),
    check('company', 'Company is required').notEmpty(),
    check('from', 'From date is required and needs to be from the past')
      .notEmpty()
      .custom((value, { req }) => (req.body.to ? value < req.body.to : true)),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      try {
        const profile = await Profile.findOne({ user: req.user.id });
  
        profile.experience.unshift(req.body);
  
        await profile.save();
  
        res.json(profile);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    }
 );

 //@desc delete exp by id
 //@acc private

router.delete("/education/:edu_id",auth,
    async (req, res) => {
        try{
            const profile = await Profile.findOne({user: req.user.id});
            const removeIndex = profile.education.map(item => item.id).indexOf(req.params.exp_id)
            profile.education.splice(removeIndex, 1);
            await profile.save()
            res.json(profile)
        }catch(err){
            console.log("Some mistake in the delete");
        }
    }
)



module.exports = router