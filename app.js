const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js")
const path = require("path");
const methodOverride = require("method-override");

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const Mongo_URL = "mongodb://127.0.0.1:27017/wanderlust"

async function main() {
    await mongoose.connect(Mongo_URL)
}

main().then(() => {
    console.log("database connection successful")
}).catch(err => console.log(err));

app.get("/", (res) => {
    res.send("hi , I am root");
})
// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My new Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India"
//     });

//     await sampleListing.save();
//     console.log("sample was saved .")
//     res.send("successful test")
// })

//index route
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
app.listen(8080, () => {
    console.log("server lis listening on port 8080");
})