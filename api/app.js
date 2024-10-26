const path = require('path');
const express = require('express');
const app = express();
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const Listing = require("../models/listing.js")

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

app.get("/listing", async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
})
app.get("/listing/new", (req, res) => {
    res.render("listings/new.ejs")

})

app.get("/listing/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });

})

app.get("/listing/:id/edit", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
})
app.post("/listing", async (req, res) => {
    // let { title, description, price, image, location, country } = req.body;
    const newListing = new Listing(req.body.listing);
    await newListing.save("listing saved successfully")
    res.redirect("/listing")
})
app.put("/listing/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listing/${id}`)
})
app.delete("/listing/:id", async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listing");

})
app.listen(port, () => {
    console.log("server listening on port", port);
})