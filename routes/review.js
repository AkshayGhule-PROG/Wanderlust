const express = require('express');
const router = express.Router({ mergeParams: true });
const ExpressError = require('../utils/ExpresseError.js');
const wrapAsync = require('../utils/WrapAsync.js');
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {ValidateReview}= require("../middleware.js")



// Create Review
router.post("/", ValidateReview, wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);
    listing.reviews.push(newReview._id);
    await newReview.save();
    await listing.save();
    req.flash("success", "Successfully created a new Review!");
    res.redirect(`/listings/${listing._id}`);
}));

// Delete Review
router.delete("/:reviewId", wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Deleted  a new Review!");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;
