const express = require("express");
const router = express.Router({ mergeParams: true })
const wrapAsync = require('../utils/wrapAsync.js')
const ExpressError = require('../utils/ExpressError.js')
const { reviewSchema } = require('../api/schema.js')
const Listing = require("../models/listing.js")
const Review = require("../models/review.js")



const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else {
        next();
    }
}

//Reviews
//post route
router.post("/", validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("new review saved")
    req.flash("success", "New Review Added!!")
    res.redirect(`/listing/${listing._id}`);

}))
//Review delete route
router.delete("/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })//code to pull or delete that review from the array of review
    let review = await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!!")
    console.log("review deleted", review)
    res.redirect(`/listing/${id}`);
}))

module.exports = router;