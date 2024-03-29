var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user.js');

module.exports = function (passport) {

    // Serialize the user for the session.
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // Deserialize the user when finished.
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    // Local strategy for user login.
    passport.use('login', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },

        // Pass the username and password into a callback function.
        function (req, username, password, done) {
            // Look for a user with the same username.
            User.findOneAndUpdate({'email': username}, {$set: {'online': true}}, function (err, user) {
                // Return any errors.
                if (err) {
                    return done(err);
                }

                // Return if the user does not exist.
                if (!user) {
                    return done(null, false, req.flash('message', 'Oops! Wrong E-Mail. Please try again.'));
                }

                // Return if the password is incorrect.
                if (!user.validPassword(password)) {
                    return done(null, false, req.flash('message', 'Oops! Wrong Password. Please try again.'));
                }

                // Return user if login is successful.
                return done(null, user);
            });

        }));

    // Local strategy for user registration.
    passport.use('register', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },

        // Pass the username and password into a callback function.
        function (req, username, password, done) {
            // Make the registration request asynchronous.
            process.nextTick(function () {

                // Look for a user with the same username.
                if (req.body.registerAccountType == 'instructor') {
                    User.findOne({'email': username}, function (err, user) {
                        // Return any errors.
                        if (err) {
                            return done(err);
                        }
                        var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(cs.toronto.edu)|(mail.utoronto.ca)$/;
                        var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

                        if (!(emailRegex.test(username))) {
                            return done(null, false, req.flash('message', "Invalid Email: (@mail.utoronto.ca or @cs.toronto.edu required)."));
                        }

                        if (!(passwordRegex.test(password))) {
                            return done(null, false, req.flash('message', "Password must be minimum eight characters, at least one uppercase letter, one lowercase letter and one number."));
                        }

                        if(password != req.body.passwordConfirm){
                            return done(null, false, req.flash('message', "Passwords do not match, please try again."));
                        }
                        // Return if a user exists;
                        if (user) {
                            return done(null, false, req.flash('message', 'Oops! This User already Exists. Try a different E-Mail!'));
                        }

                        // No users found; create a new user.
                        var newUser = new User();
                        // Set the new user's account information.
                        newUser.email = username;
                        newUser.password = newUser.generateHash(password);
                        newUser.accountType = req.body.registerAccountType
                        newUser.firstName = req.body.firstName
                        newUser.lastName = req.body.lastName
                        newUser.online = true
                        newUser.studentID = null;
                        // Save the new user.
                        newUser.save(function (err) {
                            if (err) {
                                throw err;
                            }
                            return done(null, newUser);
                        });

                    });
                }
                else {
                    User.findOne({$or: [{'studentID': req.body.studentID}, {'email': username}]}, function (err, user) {
                        // Return any errors.
                        if (err) {
                            return done(err);
                        }
                        var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(cs.toronto.edu)|(mail.utoronto.ca)$/;
                        var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
                        console.log(username)

                        if (!(emailRegex.test(username))) {
                            return done(null, false, req.flash('message', "Invalid Email: (@mail.utoronto.ca or @cs.toronto.edu required)."));
                        }

                        if (!(passwordRegex.test(password))) {
                            return done(null, false, req.flash('message', "Password must be minimum eight characters, at least one uppercase letter, one lowercase letter and one number."));
                        }

                        if(password != req.body.passwordConfirm){
                            return done(null, false, req.flash('message', "Passwords do not match, please try again."));
                        }
                        // Return if a user exists;
                        if (user) {
                            return done(null, false, req.flash('message', 'Oops! This User already Exists. Try a different Student Number or E-Mail!'));
                        }

                        // No users found; create a new user.
                        var newUser = new User();
                        // Set the new user's account information.
                        newUser.email = username;
                        newUser.password = newUser.generateHash(password);
                        newUser.accountType = req.body.registerAccountType
                        newUser.firstName = req.body.firstName
                        newUser.lastName = req.body.lastName
                        newUser.online = true
                        newUser.studentID = req.body.studentID
                        // Save the new user.
                        newUser.save(function (err) {
                            if (err) {
                                throw err;
                            }
                            return done(null, newUser);
                        });

                    });
                }

            });

        }));

};

