const express = require ("express")
const router =  express.Router();

//  posts
router.get("/",(req,res)=>{
    res.send("Hi i am post")
})
// post show users
router.get("/:id",(req,res)=>{
    res.send("Hi i am show-post")
})
// post post
router.post("/",(req,res)=>{
    res.send("Hi i am post-post")
})
// delete post 
router.delete("/:id",(req,res)=>{
    res.send("Hi i am delete-post")
})


module.exports=  router;
