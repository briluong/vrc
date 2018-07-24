const request = require('request');
var Course = require('../models/courses.js');
var Questions = require('../models/questions.js');
var Lecture = require('../models/lectures.js');
var User = require('../models/user.js');
module.exports = function (app, passport) {

    // LANDING PAGE
    app.get("/", (req, res) => {
        res.render("home", {user: null, route: null, errorMessage: req.flash('message')});
    });

    // LOGIN
    app.post("/login", passport.authenticate('login', {
        successRedirect: "/profile",
        failureRedirect: "/",
        failureFlash: true
    }));

    // REGISTER
    app.post("/register", passport.authenticate('register', {
        successRedirect: "/profile",
        failureRedirect: "/",
        failureFlash: true
    }));

    // LOGOUT
    app.get("/logout", function (req, res) {
        User.findOneAndUpdate({'_id': req.user._id}, {$set: {'online': false}}, function (err, user) {
            if (err) {
                console.log(err);
            }
            else {
                req.logout();
                res.redirect("/");
            }
        })
    });

    // PROFILE
    app.get("/profile", isLoggedIn, function (req, res) {
            if (req.user.accountType == 'instructor') {
                Course.find({
                        "instructors.email": req.user.email
                    }
                    , function (err, course) {
                        if (err) {
                            console.log(err);
                        } else {
                            // pass matched documents to template
                            res.render("profile", {user: req.user, course: course, route: null});
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
                        // pass matched documents to template
                        res.render("profile", {user: req.user, course: course, route: null});
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
        Course.findOne({'_id': req.params.id}, function (err, course) {
            if (err) {
                console.log(err);
            } else {
                // pass matched documents to template
                User.find(function (err, users) {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        res.render("course", {user: req.user, course: course, users: users, route: course.code});
                    }
                })
            }
        })

    });

    app.get("/course/:id/:lectureID", isLoggedIn, function (req, res) {
        Questions.find({'lectureID': req.params.lectureID}, function (err, questions) {
            if (err) {
                console.log(err);
            } else {
                Course.findOne({'_id': req.params.id}, function (err, course) {
                    if (err) {
                        console.log(err);
                    } else {
                        // pass matched documents to template
                        User.find(function (err, users) {
                            if (err) {
                                console.log(err)
                            }
                            else {
                                Lecture.findOne({'_id': req.params.lectureID}, function (err, lecture) {
                                    if (err) {
                                        console.log(err)
                                    }
                                    else {
                                        res.render("lecture", {
                                            user: req.user,
                                            course: course,
                                            users: users,
                                            route: lecture.title,
                                            lecture: lecture,
                                            question: questions
                                        });

                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    })

    app.get("/course/:id/:lectureID/stream", isLoggedIn, function (req, res) {
        Lecture.findOne({'_id': req.params.lectureID}, function (err, lecture) {
            if (err) {
                console.log(err)
            }
            else {
                res.render("stream", {
                    user: req.user,
                    groupName: req.params.groupName,
                    lectureID: req.params.lectureID,
                    courseID: req.params.id,
                    youtube: lecture.youtube
                });
            }
        })
    })

    app.get("/course/:id/:lectureID/:groupName", isLoggedIn, function (req, res) {
        res.render("group", {
            user: req.user,
            groupName: req.params.groupName,
            lectureID: req.params.lectureID,
            courseID: req.params.id
        });
    })
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