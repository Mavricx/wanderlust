const express = require('express');
const app = express();
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const ExpressError = require('../utils/ExpressError.js')
const listings = require("../routes/listing.js")
const reviews = require("../routes/review.js")


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

app.use("/listing", listings);
app.use("/listing/:id/reviews", reviews)

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