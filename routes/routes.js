const request = require('request');

module.exports = function(app, passport) {

    // LANDING PAGE
    app.get("/", (req, res) => {
        res.render("home");
    });

    // LOGIN
    app.post("/login", passport.authenticate('login', {
        successRedirect : "/hello",
        failureRedirect : "/hi",
    }));

    // REGISTER
    app.post("/register", passport.authenticate('register', {
        successRedirect : "/profile",
        failureRedirect : "/fail",
    }));
    //
    // // LOGOUT
    // app.get("/logout", function(req, res) {
    //     req.logout();
    //     res.redirect("/");
    // });
    //
    // PROFILE
    app.get("/profile", isLoggedIn, function(req, res) {
        console.log("Registered!")
        res.render("home", {user: req.user});
    });
    //
    // // MARKET
    // app.get("/market", isLoggedIn, function(req, res) {
    //     res.render("market", {user: req.user});
    // });
    //
    // // CONTACT US
    // app.get("/contact", function(req, res) {
    //     res.render("contact", {user: req.user});
    // });
    //
    // // MARKET
    // app.get("/market", isLoggedIn, function(req, res) {
    //     res.render("market", {user: req.user});
    // });
    //
    // // Authentication middleware.
    function isLoggedIn(req, res, next) {
        // Continue if the user is authenticated.
        if (req.isAuthenticated()) {
            return next();
        }
        // Redirect unauthenticated users to the home page.
        res.redirect("/");
    }

}
