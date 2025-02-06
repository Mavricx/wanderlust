const Listing = require("../models/listing.js");

module.exports.index = async (req, res, next) => { //get to all listings
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
}


module.exports.renderNewForm = (req, res) => { //get to new form
    res.render("listings/new.ejs")
}


module.exports.showListing = async (req, res, next) => { //get to individual listing
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" }, }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!!");
        return res.redirect("/listing");
    }
    res.render("listings/show.ejs", { listing });
}


module.exports.renderEditForm = async (req, res, next) => { //get to edit form
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!!");
        res.redirect("/listing");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/c_scale,w_300");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
}


module.exports.createListing = async (req, res, next) => { //post request
    // let { title, description, price, image, location, country } = req.body;
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename }
    await newListing.save("listing saved successfully")
    req.flash("success", "New Listing Created!!")
    res.redirect("/listing");
}


module.exports.updateListing = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (req.file) {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save()
    }
    req.flash("success", "Listing Updated !!")
    res.redirect(`/listing/${id}`)
}

module.exports.destroyListing = async (req, res, next) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted !!")
    console.log(deletedListing);
    res.redirect("/listing");
}