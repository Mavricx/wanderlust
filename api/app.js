const express = require('express');
const app = express();
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const ExpressError = require('../utils/ExpressError.js');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require('../models/user.js');

const listingRouter = require("../routes/listing.js");
const reviewRouter = require("../routes/review.js");
const userRouter = require("../routes/user.js")

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


const sessionOptions = {
    secret: "mysupersecret",//should be changed later.
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}


app.get("/", (req, res) => {//incomplete home page // to add login and signin page
    res.render("listings/home.ejs")
});


app.use(session(sessionOptions));
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));//in-built method to authenticate
passport.serializeUser(User.serializeUser());//load credentials to the session.
passport.deserializeUser(User.deserializeUser());//extract from session

app.use((req, res, next) => {//middleware for storing flash.
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    next();
})

app.get("/demouser", async (req, res) => {
    const fakeUser = new User({
        email: "student@example.com",
        username: "normalstudent",
    })
    let registeredUser = await User.register(fakeUser, "helloworld");//automatically checks if there same user exist or not.
    res.send(registeredUser);
})//hashing algorithm used pbkdf2.

app.use("/listing", listingRouter);
app.use("/listing/:id/reviews", reviewRouter)
app.use("/", userRouter)


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