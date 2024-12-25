const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js")
const wrapAsync = require('../utils/wrapAsync.js')
const ExpressError = require('../utils/ExpressError.js')
const { listingSchema } = require('../api/schema.js')



const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg)
    }
    else {
        next();
    }
}

//all listing route
router.get("/", wrapAsync(async (req, res, next) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
}))

//add new listing route
router.get("/new", (req, res) => {
    res.render("listings/new.ejs")
})

//show each listing route
router.get("/:id", wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!!");
        res.redirect("/listing");
    }

    res.render("listings/show.ejs", { listing });
}))

//get edit listing route
router.get("/:id/edit", wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!!");
        res.redirect("/listing");
    }
    res.render("listings/edit.ejs", { listing });
}))

//post listing route
router.post("/", validateListing, wrapAsync(async (req, res, next) => {
    // let { title, description, price, image, location, country } = req.body;

    const newListing = new Listing(req.body.listing);
    await newListing.save("listing saved successfully")
    req.flash("success", "New Listing Created!!")
    res.redirect("/listing");
}))

//put / edit route
router.put("/:id", validateListing, wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listing/${id}`)
}))

//delete route
router.delete("/:id", wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted !!")
    console.log(deletedListing);
    res.redirect("/listing");
}))

module.exports = router;