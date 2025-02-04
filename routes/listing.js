const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js")
const wrapAsync = require('../utils/wrapAsync.js')
const { isLoggedIn, isOwner, validateListing } = require("../api/middleware.js")




//all listing route
router.get("/", wrapAsync(async (req, res, next) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
}))

//add new listing route
router.get("/new", isLoggedIn, (req, res) => {

    res.render("listings/new.ejs")
})

//show each listing route
router.get("/:id", wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" }, }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!!");
        return res.redirect("/listing");
    }
    res.render("listings/show.ejs", { listing });
}))

//get edit listing route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!!");
        res.redirect("/listing");
    }
    res.render("listings/edit.ejs", { listing });
}))

//post listing route
router.post("/", validateListing, isLoggedIn, wrapAsync(async (req, res, next) => {
    // let { title, description, price, image, location, country } = req.body;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save("listing saved successfully")
    req.flash("success", "New Listing Created!!")
    res.redirect("/listing");
}))

//put / edit route
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    let listing = Listing.findById(id);
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated !!")
    res.redirect(`/listing/${id}`)
}))

//delete route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted !!")
    console.log(deletedListing);
    res.redirect("/listing");
}))

module.exports = router;