const express = require('express');
const users = require('./userDb.js');
const posts = require('../posts/postDb.js')
const router = express.Router();


//POST--Create USER
router.post('/', validateUser, async (req, res) => {
    try {
        const newUser = await users.insert(req.body);
        res.status(201).json(newUser);
    } catch (error){
        res.status(500).json({message: error});
    }
});

//POST--Create a post for USER by ID
router.post('/:id/posts', validateUserId,validatePost, async (req, res) => {
    try{
        const newPost = await posts.insert(req.body);
        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json(error);
    }
});

//GET
router.get('/', async (req, res) => {
    try{
        const usersInfo = await users.get(req.query);
        res.status(200).json(usersInfo)
    }
    catch (error){
        console.log(error);
        req.status(500).json({
            message: "Error retrieving users"
        });
    }
});

router.get('/:id', validateUserId, (req, res) => {
    res.status(200).json(req.user);
});

router.get('/:id/posts', validateUserId, async (req, res) => {
    try {
        const posts = await users.getUserPosts(req.params.id);
        if (posts){
            res.status(200).json(posts);
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({message: error});
    }
});

router.delete('/:id', validateUserId, async (req, res) => {
    try {
        const deletedUser = await users.remove(req.params.id);
        res.status(200).json({message: "The requested user was deleted"})
        
    } 
    catch (error) {
        console.log(error);
        res.status(500).json({message: "Error deleting the user"})
    }
});

router.put('/:id', validateUserId,validateUser, async (req, res) => {
    const updatedUser = await users.update(req.params.id, req.body);
    res.status(200).json(req.body);
});

//custom middleware

async function validateUserId(req, res, next) {
    try{
        const {id} = req.params;
        const user = await users.getById(id);
        if(user){
            req.user= user;
            next();
        } else {
         res.status(404).json({ message: "invalid user id" })
        }
    } catch (error) {
        res.status(500).json(error)
    }   
};

function validateUser(req, res, next) {
    try {
        if (req.body && Object.keys(req.body).length > 0){
            if (req.body.name){
                next();
            } else {
                res.status(400).json({message:"missing required name field"})
            }
        } else {
            res.status(400).json({ message: "missing user data" });
        }
    }
    catch(error){
        res.status(500).json(error);
    }
};

function validatePost(req, res, next) {
    try {
        if (req.body && Object.keys(req.body).length > 0){
            if (req.body.text && req.body.user_id){
                next();
            } else {
                res.status(400).json({message:"missing required text field"})
            }
        } else {
            res.status(400).json({ message: "missing post data" });
        }
    }
    catch(error){
        res.status(500).json(error);
    }
};

module.exports = router;
