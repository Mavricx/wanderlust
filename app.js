const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js")

const Mongo_URL = "mongodb://127.0.0.1:27017/wanderlust"

async function main() {
    await mongoose.connect(Mongo_URL)
}

main().then(() => {
    console.log("database connection successful")
}).catch(err => console.log(err));

app.get("/", (req, res) => {
    res.send("hi , I am root");
})
app.get("/testListing", async (req, res) => {
    let sampleListing = new Listing({
        title: "My new Villa",
        description: "By the beach",
        price: 1200,
        location: "Calangute, Goa",
        country: "India"
    });

    await sampleListing.save();
    console.log("sample was saved .")
    res.send("successful test")
})
app.listen(8080, () => {
    console.log("server lis listening on port 8080");
})