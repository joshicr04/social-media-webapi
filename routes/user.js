const express = require("express");
const router = express.Router();
const User = require("./../models/User");
const bCrypt = require('bcrypt');

//Update
router.put("/edit/:id", async (req, res)=>{
    if(req.body.userId === req.params.id){
        if(req.body.password){
            try{
                const salt = await bCrypt.genSalt(10);
                req.body.password = await bCrypt.hash(req.body.password, salt);
            }catch(err){
                return res.status(500).json(err);
            }
        }
        try{
            const user = await User.findByIdAndUpdate(req.params.id, {$set: req.body},{new: true});
            res.status(200).json(user);
        }catch(err){
            return res.status(500).json(err);
        }
    }else{
        return res.status(401).json("You can update only your account.");
    };
});

//Get a User
router.get("/:id", async (req, res)=>{
    try{
        const user = await User.findById(req.params.id);
        if(!user){
            res.status(404).json('User not found.')
        }
        const{password, ...others} = user._doc;
        res.status(200).json(others);
    }catch(err){
        //return res.status(500).json(err);
    }
});

//Delete User
router.delete("/:id", async (req, res)=>{
    if(req.body.userId === req.params.id){
        try{
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("User has been deleted sucessfully.");
        }catch(err){
            return res.status(500).json(err);
        }
    }else{
        return res.status(401).json("You can only delete your account.");
    }
})
//Follow User
router.put("/:id/follow", async(req, res)=>{
    if(req.body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$push:{followers: req.body.userId}});
                await currentUser.updateOne({$push:{followings: req.params.id}});
                res.status(200).json("User has been followed.")
            }else{
                res.status(403).json("You already follow this user.");
            }
        }catch(err){
            res.status(500).json(err);
        }
    }else{
        res.status(403).json("You can not follow yourself.");
    }
})

//Unfollow User
router.put("/:id/unfollow", async(req, res)=>{
    if(req.body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
        if(user.followers.includes(req.body.userId)){
            await user.updateOne({$pull:{followers:req.body.userId}});
            await currentUser.updateOne({$pull:{followings: req.params.id}});
            res.status(200).json("You has been unfollowed the user.")
        }else{
            res.status(403).json("You don not unfollow.")
        }
        }catch(err){
            res.status(500).json(err);
        }
    }else{
        res.status(403).json("You can not unfollow yourself.");
    }
})
module.exports = router;