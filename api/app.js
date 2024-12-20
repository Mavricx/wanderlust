const path = require('path');
const express = require('express');
const app = express();
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const Listing = require("../models/listing.js")
const wrapAsync = require('../utils/wrapAsync.js')
const ExpressError = require('../utils/ExpressError.js')
const { listingSchema, reviewSchema } = require('./schema.js')
const Review = require('../models/review.js')

require('dotenv').config({ path: '../.env' });
const dbUrl = process.env.MONGO_URL;
const port = process.env.PORT || 3000;

app.set("views", path.join(__dirname, '../views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, '../public')));



async function main() {
    await mongoose.connect(dbUrl);
}

main().then(() => {
    console.log("database connection successful");
}).catch(err => console.log(err));


app.get("/", (req, res) => {
    res.render("listings/home.ejs")
});


const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errMsg)
    }
    else {
        next();
    }
}


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
app.get("/listing", wrapAsync(async (req, res, next) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
}))


app.get("/listing/new", (req, res) => {
    res.render("listings/new.ejs")
})


app.get("/listing/:id", wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
}))


app.get("/listing/:id/edit", wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}))


app.post("/listing", validateListing, wrapAsync(async (req, res, next) => {
    // let { title, description, price, image, location, country } = req.body;

    const newListing = new Listing(req.body.listing);
    await newListing.save("listing saved successfully")
    res.redirect("/listing");
}))


app.put("/listing/:id", validateListing, wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listing/${id}`)
}))


app.delete("/listing/:id", wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listing");
}))

//Reviews
//post route
app.post("/listing/:id/reviews", validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("new review saved")
    res.redirect(`/listing/${listing._id}`);

}))
//Review delete route
app.delete("/listing/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })//code to pull or delete that review from the array of review
    let review = await Review.findByIdAndDelete(reviewId);
    console.log("review deleted", review)
    console.log("listing updated", listing);
    res.redirect(`/listing/${id}`);
}))
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"))
})


//error handling middleware
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { err });
    // res.status(statusCode).send(message);
})

app.listen(port, () => {
    console.log("server listening on port: ", port);
})