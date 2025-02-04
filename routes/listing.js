const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js')
const { isLoggedIn, isOwner, validateListing } = require("../api/middleware.js")

const listingController = require("../controllers/listings.js")


router.route("/")
    .get(wrapAsync(listingController.index))//all listing route
    .post(validateListing, isLoggedIn, wrapAsync(listingController.createListing))//post listing route

//add new listing route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
    .get(wrapAsync(listingController.showListing))  //show each listing route
    .put(isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing)) //put / edit route
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing)) //delete route


//get edit listing route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm))


module.exports = router;