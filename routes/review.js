const express = require('express');
const router = express.Router({ mergeParams: true });
const ExpressError = require('../utils/ExpresseError.js');
const wrapAsync = require('../utils/WrapAsync.js');
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {ValidateReview, isLoggedIn,isReviewAuthor}= require("../middleware.js")

const review = require("../controllers/review.js")

// Create Review
router.post("/",isLoggedIn, ValidateReview, wrapAsync(review.createReview));

// Delete Review
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(review.deleteReview));

module.exports = router;
