const express = require('express');
const router = express.Router();
const User = require("../models/users.js");
const WrapAsync = require('../utils/WrapAsync.js');
const passport = require('passport');
const { savedRedirectUrl } = require("../middleware.js");



router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs")
})

router.post("/signup", WrapAsync(async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            console.log(registeredUser);
            req.flash("success", "Welcome to Wanderlust");
            res.redirect(req.session.redirectUrl);
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}));


router.get("/login",(req,res)=>{
    res.render("users/login.ejs")
})

router.post("/login",savedRedirectUrl ,passport.authenticate('local', { failureRedirect: '/login' ,
    failureFlash: true, // Enable flash messages for authentication failure
}),(req,res)=>{
    req.flash("success", "Welcome Back to Wanderlust");
    // Check if the user is authenticated and has a redirect URL stored in session
    let redirectUrl = req.session.redirectUrl || "/listings";
    res.redirect(redirectUrl); // Redirect to the stored URL or default to "/listings"
})


router.get("/logout",(req,res)=>{
    req.logout((err) => {
        if (err) {
            console.error(err); // Log the error if logout fails
            return res.redirect("/listings"); // Redirect to listings on error
        }
        req.flash("success","logged out suuccessfully");
        res.redirect("/listings"); // Redirect to listings after successful logout
    });
})



module.exports= router;