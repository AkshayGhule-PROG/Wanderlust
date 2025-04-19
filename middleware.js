const Listing = require("./models/listing");
const ExpressError = require('./utils/ExpresseError.js');
const { listingSchema } = require("./schema.js");
const {reviewSchema} = require("./models/review.js");

module.exports.isLoggedIn=(req,res,next)=>{
    console.log(req.user)
if(!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl; // Store the original URL in session
    req.flash("error", "You must be signed in to create a listing!");
    return res.redirect("/login");
}
next();
}

module.exports.savedRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=(req,res,next)=>{
    const { id } = req.params;
    if (!req.user._id.equals(res.locals.currentUser._id)) {
        req.flash("error","You Do Not Have Permission To Edit This Listing!!")
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.Validatelisting=(req,res,next)=>{
    const { listing } = req.body;
    const { title, price, description, location } = listing;
    if (!title || !price || !description || !location) {
        req.flash("error", "All fields are required!");
        return res.redirect("/listings/new");
    }
    next();
}

module.exports.ValidateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error.details.map(err => err.message).join(", "));
    }
    next();
};