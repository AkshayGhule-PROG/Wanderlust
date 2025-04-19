const express = require ("express")
const router =  express.Router();

// const router = require("express").Router();


// get users
router.get("/",(req,res)=>{
    res.send("Hi i am user")
})
// show users
router.get("/:id",(req,res)=>{
    res.send("Hi i am show-user")
})
// post users
router.post("/",(req,res)=>{
    res.send("Hi i am post-user")
})
// get users
router.delete("/:id",(req,res)=>{
    res.send("Hi i am delete-user")
})


module.exports=router;