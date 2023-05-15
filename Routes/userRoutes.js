
const { signup, login } = require("../Controller/userController");
const User = require("../Models/User")
const jwt = require('jsonwebtoken');

const userRoter = require("express").Router();

userRoter.post("/signup" , signup)
userRoter.post('/login' , login)


let verifyToken = (req,res,next)=>{
    let token = req.headers["token"];
    if(!token){
        res.status(400).send({message:"No token provided"})
    }else{
        jwt.verify(token,process.env.SECRET_KEY,(err,decoded)=>{
            if(err){
                res.status(400).send({message:"Failed to authenticate token"})
            }else{
                req.decoded = decoded;
                next();
            }
        })
    }
}

userRoter.get("/",verifyToken,(req,res)=>{
    res.send({message: "Welcome to the user router ( A secret to protect)"})
})

module.exports = userRoter;
