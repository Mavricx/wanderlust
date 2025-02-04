const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js')
const { isLoggedIn, isOwner, validateListing } = require("../api/middleware.js")

const listingController = require("../controllers/listings.js")




//all listing route
router.get("/", wrapAsync(listingController.index));

//add new listing route
router.get("/new", isLoggedIn, listingController.renderNewForm);

//show each listing route
router.get("/:id", wrapAsync(listingController.showListing))

//get edit listing route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm))

//post listing route
router.post("/", validateListing, isLoggedIn, wrapAsync(listingController.createListing))

//put / edit route
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing))

//delete route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing))

module.exports = router;