const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/WrapAsync.js');
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,Validatelisting}= require("../middleware.js")
const multer  = require('multer')
const { storage } = require('../cloudConfig.js')
const upload = multer({ storage })


const { CloudinaryStorage } = require('multer-storage-cloudinary');
const listingscontroller = require("../controllers/listings.js")


router
  .route("/")
  .get(wrapAsync(listingscontroller.index))
  .post(
    isLoggedIn,
    upload.single('listing[image]'),
    Validatelisting,
    wrapAsync(listingscontroller.create)
  );

// New Listing Form
router.get("/new", isLoggedIn, listingscontroller.new);

// Show, Update, Delete (for a specific listing)
router
  .route("/:id")
  .get(wrapAsync(listingscontroller.show))
  .put(isLoggedIn, isOwner,  upload.single('listing[image]'),Validatelisting, wrapAsync(listingscontroller.update))
  .delete(isLoggedIn, isOwner, wrapAsync(listingscontroller.delete));


// Edit Listing Form
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingscontroller.edit));





module.exports = router;
