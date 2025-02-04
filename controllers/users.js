const User = require("../models/user");


module.exports.renderSignupForm = (req, res) => {
    res.render("../views/user/signup.ejs");
}


module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);//push new user into the database.
        req.login(registeredUser, (err) => {//automatically login ,after our sign up
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to WanderLust!!");
            console.log(registeredUser)
            res.redirect("/listing");
        })
    }
    catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}



module.exports.renderLoginForm = (req, res) => {
    res.render("../views/user/login.ejs")
}



module.exports.login = async (req, res) => {
    req.flash("success", "Welcome!!  You are Logged into Wanderlust. ")
    redirectUrl = res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl);//using the saved url from the locals instead of the req.session.redirectUrl because passport resets the session after login and we lose the saved url but it can be accessed from locals if it is saved in middleware savedRedirectUrl.
}


module.exports.logout= (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are Logged Out!!")
        res.redirect("/listing")
    })
}