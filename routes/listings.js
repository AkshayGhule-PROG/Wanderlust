const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/WrapAsync.js');
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,Validatelisting}= require("../middleware.js")


// Index
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
}));

// New
router.get("/new", isLoggedIn,(req, res) => {
    console.log(req.user);
    res.render("listings/new");
});

// Show
router.get("/:id", wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id).populate("reviews").populate("owner");
    if (!listing) {
        req.flash("error","Listing You Requested For Does Not Exist!!")
        res.redirect("/listings")
    }
    console.log(listing);
    res.render("listings/show", { listing });
}));

// Create
router.post("/", isLoggedIn, Validatelisting, wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id; // Set the owner to the currently logged-in user
    await newListing.save();
    req.flash("success", "Successfully created a new listing!");
    res.redirect("/listings");
}));

// Edit
router.get("/:id/edit", isLoggedIn,isOwner ,wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        req.flash("error","Listing You Requested For Does Not Exist!!")
        res.redirect("/listings")
    }
    res.render("listings/edit", { listing });
}));

// Update
router.put("/:id",  isLoggedIn,isOwner,Validatelisting, wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
   
    await Listing.findByIdAndUpdate(req.params.id, { ...req.body.listing });

    req.flash("success", "Successfully updated a listing!");
    res.redirect(`/listings/${req.params.id}`);
}));

// Delete
router.delete("/:id",  isLoggedIn,isOwner,wrapAsync(async (req, res) => {
    await Listing.findByIdAndDelete(req.params.id);
    req.flash("success", "deleted a listing!");
    res.redirect("/listings");
}));

module.exports = router;
