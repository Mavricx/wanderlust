const express = require("express");
const router = express.Router();
const User = require("../models/user.js")
const wrapAsync = require("../utils/wrapAsync.js")
const passport = require("passport");
const { saveRedirectUrl } = require("../api/middleware.js");

const userController = require("../controllers/users.js")

router.get("/signup", userController.renderSignupForm)

router.post("/signup", wrapAsync(userController.signup))

router.get("/login", userController.renderLoginForm)
router.post("/login", saveRedirectUrl,
    passport.authenticate('local',//if the provided credentials passthrough this middleware then it goes for the code inside post request otherwise it redirects back to login page.
        {
            failureRedirect: '/login',
            failureFlash: true
        }), userController.login);

router.get("/logout", userController.logout)
module.exports = router;