const express = require("express");
const router = express.Router();
const User = require("../models/user.js")
const wrapAsync = require("../utils/wrapAsync.js")
const passport = require("passport")


router.get("/signup", (req, res) => {
    res.render("../views/user/signup.ejs");
})

router.post("/signup", wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);//push new user into the database.
        req.flash("success", "Welcome to WanderLust!!");
        console.log(registeredUser)
        res.redirect("/listing");
    }
    catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }

}))

router.get("/login", (req, res) => {
    res.render("../views/user/login.ejs")
})
router.post("/login",
    passport.authenticate('local',//if the provided credentials passthrough this middleware then it goes for the code inside post request otherwise it redirects back to login page.
        {
            failureRedirect: '/login',
            failureFlash: true
        }),
    async (req, res) => {
        req.flash("success", "Welcome You are Logged into Wanderlust. ")
        res.redirect("/listing");
    })

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are Logged Out!!")
        res.redirect("/listing")
    })
})
module.exports = router;