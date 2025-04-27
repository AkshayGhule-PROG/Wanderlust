const express = require('express');
const router = express.Router();
const User = require("../models/users.js");
const WrapAsync = require('../utils/WrapAsync.js');
const passport = require('passport');
const { savedRedirectUrl } = require("../middleware.js");

const user = require("../controllers/user.js")


// Show signup form
router.get("/signup", user.renderSignup);

// Handle signup logic
router.post("/signup", WrapAsync(user.signup));

// Show login form
router.get("/login", user.renderLogin);

// Handle login logic
router.post("/login", savedRedirectUrl, passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true,
}), user.login);

// Handle logout
router.get("/logout", user.logout);




module.exports= router;