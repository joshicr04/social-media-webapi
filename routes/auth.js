const express = require('express');
const router = express.Router();
const User = require("./../models/User");
const bCrypt = require('bcrypt');
 //Register User
router.post("/register", async(req, res)=>{
    try{
        const salt = await bCrypt.genSalt(10);
        const hashedPassword = await bCrypt.hash(req.body.password, salt);

        const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
    });

        const savedUser = await newUser.save();
        res.status(200).json(savedUser);
    }catch(err){
        return res.status(500).json(err);
    }
});

//Login
router.post("/login", async(req, res)=>{
    try{
        const user = await User.findOne({email: req.body.email});
        !user && res.status(404).json(`Wrong Credentials.`);

        const validPassword = await bCrypt.compare(req.body.password, user.password);
        !validPassword && res.status(404).json(`Wrong Credentials.`);

        res.status(200).json(user);

    }catch(err){
        return res.status(500).json(err);
    }
});


module.exports = router;