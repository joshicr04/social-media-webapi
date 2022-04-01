const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config({path:'.env'});
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');
const multer = require('multer');

const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const postRoute = require('./routes/post');

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/post", postRoute);

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, "public/images");
    },
    filename:(req, file, cb)=>{
        cb(null, file.originalname);
    }
});
const upload = multer({storage});
app.post("/api/upload", upload.single("file"), (req, res)=>{
    try{
        return res.status(200).json("File Uploaded Successfully.");
    }catch(err){
        console.log(err);
    }
})

app.listen(process.env.PORT || 8000, ()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
});

mongoose.connect("mongodb://localhost:27017/SocialMedia", {useNewUrlParser: true, useUnifiedTopology:true}, ()=>{
    console.log(`MongoDB connected with server...`);
})