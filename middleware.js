const Listing = require("./models/listing");
const Review = require("./models/review.js");
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
    const { comment, rating } = req.body.review;

    // Check if comment and rating are provided
    if (!comment || !rating) {
        req.flash('error', 'Comment and Rating are required.');
        return res.redirect(`/listings/${req.params.listingId}`); // Redirect to the listing page
    }

    // Check if rating is between 1 and 5
    if (rating < 1 || rating > 5) {
        req.flash('error', 'Rating must be between 1 and 5.');
        return res.redirect(`/listings/${req.params.listingId}`); // Redirect to the listing page
    }

    next(); // Proceed if everything is valid
};


module.exports.isReviewAuthor=async (req,res,next)=>{
    const {id, reviewId } = req.params;
    const review = await Review.findById(reviewId)
    if (!review.author.equals(res.locals.currentUser._id)) {
        req.flash("error","You Do Not Have Permission To delete This Review!!")
        return res.redirect(`/listings/${id}`);
    }
    next();
}