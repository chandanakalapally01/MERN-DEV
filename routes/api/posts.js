const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator/check')

const User = require('../../models/User')
const auth = require('../../middleware/auth')
const Profile = require('../../models/Profile')
const Post = require('../../models/Post')

//@desc Create a post
//@acc Private
router.post("/", 
    auth,
    check("text","Text cannot be empty").notEmpty(),
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.status(408).json({errors: errors.array()})
        }
        try{
            const user = await User.findById(req.user.id);
            const newPost = await new Post({
                text: req.body.text,
                name: user.name,
                user: req.user.id
            })
            await newPost.save()
            res.json(newPost)
        }catch(err){
            res.send("Some error in the create a profile")
        }
    }
)

router.get("/", auth, async (req, res) => {
    try{
        const posts = await Post.find().sort({date: -1})
        res.json(posts)
    }catch(err){
        res.send("Error in the get all posts");
    }
})

router.get("/:post_id", auth, async (req, res) => {
    try{
        const post = await Post.findById(req.params.post_id)
        if(!post){
            return res.status(604).json({msg: "Post does'nt exist"})
        }
        res.json(post)
    }catch(err){
        res.send("Error in the get all posts");
    }
})

router.delete("/:post_id", auth, async (req, res) => {
    try{
        const post = await Post.findById(req.params.post_id)
        if(!post){
            return res.status(604).json({msg: "Post does'nt exist"})
        }
        if(Post.user.toString() !== req.user.id){
            return res.status(604).json({msg: "Not authorized to delete a post"})
        }
        await post.remove()
        res.json("Post deleted")
    }catch(err){
        res.send("Error in the delete a post");
    }
})

//some error in the code

router.put("/like/:post_id", auth, async (req, res) => {
    try{
        const post = Post.findById(req.params.post_id)
        if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
            return res.status(400).json({msg: "Post already liked"})
        }
        post.likes.unshift({user: req.user.id})

        await post.save()
        res.json(post)
    }catch(err){
        res.send("Error in a like")
    }
})

module.exports = router