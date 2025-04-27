
const Listing = require("../models/listing.js")

module.exports.index =async (req, res) => {
        const allListings = await Listing.find({});
        res.render("listings/index", { allListings });
}

module.exports.new = (req, res) => {
    console.log(req.user);
    res.render("listings/new");
}

module.exports.show = async (req, res) => {
    const listing = await Listing.findById(req.params.id)
    .populate({
      path: 'reviews',
      populate: {
        path: 'author', // This is the correct way to populate the author inside reviews
      }
    })
    .populate('owner'); // This is for populating the owner field
  
    if (!listing) {
        req.flash("error","Listing You Requested For Does Not Exist!!")
        res.redirect("/listings")
    }
    console.log(listing);
    res.render("listings/show", { listing });
}


module.exports.create = async (req, res) => {
    try {
        let url= req.file.path;
        let filename = req.file.filename;
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = {url ,filename}
        await newListing.save();
        req.flash("success", "Successfully created a new listing!");
        res.redirect("/listings");
    } catch (error) {
        console.error(error);
        req.flash("error", "Failed to create listing.");
        res.redirect("/listings");
    }
}

module.exports.edit =async (req, res) => {
    
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        req.flash("error","Listing You Requested For Does Not Exist!!")
        res.redirect("/listings")
    }
    let OrignalImageUrl = listing.image.url;
    OrignalImageUrl=OrignalImageUrl.replace("/upload","/upload/h_300,w_250")
    res.render("listings/edit", { listing ,OrignalImageUrl });
}

module.exports.update = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {
        // If a new file is uploaded, update the image field
        const url = req.file.path;
        const filename = req.file.filename;
        listing.image = { url, filename }; // corrected 'imag' to 'image'
    }

    await listing.save();
    req.flash("success", "Successfully updated a listing!");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.delete = async (req, res) => {
    await Listing.findByIdAndDelete(req.params.id);
    req.flash("success", "deleted a listing!");
    res.redirect("/listings");
}
