const request = require('request');
var Course = require('../models/courses.js');
var Lecture = require('../models/lectures.js');
module.exports = function (app, passport) {

    // LANDING PAGE
    app.get("/", (req, res) => {
        res.render("home", {user: null});
    });

    // LOGIN
    app.post("/login", passport.authenticate('login', {
        successRedirect: "/profile",
        failureRedirect: "/",
    }));

    // REGISTER
    app.post("/register", passport.authenticate('register', {
        successRedirect: "/profile",
        failureRedirect: "/",
    }));

    // LOGOUT
    app.get("/logout", function (req, res) {
        req.logout();
        res.redirect("/");
    });

    // PROFILE
    app.get("/profile", isLoggedIn, function (req, res) {
            console.log(req.user)
            if (req.user.accountType == 'instructor') {
                Course.find({
                    'ownerId': req.user._id, $or: [{
                        instructors: {
                            $elemMatch: {'email': req.user.email}
                        }
                    }]
                }, function (err, course) {
                    if (err) {
                        console.log(err);
                    } else {
                        // pass matched documents to template
                        console.log(course)
                        res.render("profile", {user: req.user, course: course, route: '/profile'});
                    }
                })
            }
            else {
                Course.find({
                    'active': true, $and: [{'students': req.user.studentID}]
                }, function (err, course) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(course)
                        // pass matched documents to template
                        res.render("profile", {user: req.user, course: course});
                    }
                })
            }
        }
    );


    // MARKET
    app.get("/create_new_course", isLoggedIn, function (req, res) {
        res.render("create_new_course", {user: req.user});
    });
    app.get("/course/:id", isLoggedIn, function (req, res) {
        console.log(req.params)
        Course.findOne({'_id': req.params.id}, function (err, course) {
            if (err) {
                console.log(err);
            } else {
                // pass matched documents to template
                console.log(course)
                res.render("course", {user: req.user, course: course, currentPage: ''});
            }
        })

    });
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
