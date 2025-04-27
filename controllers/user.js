const User = require("../models/users.js");


module.exports.renderSignup =(req, res) => {
        res.render("users/signup.ejs")
}

module.exports.signup = async (req, res, next) => {
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
}

module.exports.renderLogin = (req,res)=>{
    res.render("users/login.ejs")
}

module.exports.login = (req,res)=>{
    req.flash("success", "Welcome Back to Wanderlust");
    // Check if the user is authenticated and has a redirect URL stored in session
    let redirectUrl = req.session.redirectUrl || "/listings";
    res.redirect(redirectUrl); // Redirect to the stored URL or default to "/listings"
}

module.exports.logout = (req,res)=>{
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash("success", "Goodbye! See you again soon!");
        res.redirect("/listings");
      });
}