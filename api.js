const apiUtil = require('./api_util');
const User = require('./models/user');
const Course = require('./models/courses');
const Papa = require('papaparse')
// var multer  = require('multer')
// var upload = multer({ dest: 'uploads/' })

module.exports = function (app) {

    // API call to buy a currency
    app.post("/api/createCourse", apiUtil.isLoggedIn, (req, res) => {
        if (!req.body) {
            return res.sendStatus(400);
        }
        console.log(req.body)
        console.log(req.user)
        // Search for a user and update their wallet.
        var course = new Course();
        course.ownerId = req.user._id
        course.instructors = [req.user._id]
        course.title = req.body.newCourseName
        course.code = req.body.newCourseCode
        course.description = req.body.newCourseDescription
        console.log("file" in req.body)
        if ("file" in req.body) {
            var students = req.body.file
            let enrolledStudents = []
            for (let i = 0; i < students.length; i++) {
                let entry = students[i]
                if (entry.hasOwnProperty('StudentID')) {
                    enrolledStudents.push(entry['StudentID'])
                }
            }
            course.students = enrolledStudents;
        }
        else {
            course.students = []
        }
        course.save(function(err, data) {
            if (err) {
                throw err;
            }
            console.log(data)
            return res.sendStatus(200);
        });
    });


    // API call to sell a currency.
    app.post("/api/wallet/decrement", apiUtil.isLoggedIn, (req, res) => {
        if (!req.body.coinID) {
            // No coin ID to sell.
            return res.sendStatus(400);
        }
        // Search user for which to sell the currency.
        User.findOne({username: req.user.username}, (err, user) => {
            if (err) {
                //Server error.
                return res.sendStatus(500);
            }

            if (!user) {
                // No user to sell coins.
                return res.sendStatus(400);
            }


            if (user.wallet[req.body.coinID] > 1) {
                // Sell a coin if there's more to sell.
                user.wallet[req.body.coinID] -= 1;
            } else {
                // Remove the coin from the wallet if there's no more.
                delete user.wallet[req.body.coinID];
            }

            // Save the changes to the document.
            User.findOneAndUpdate({username: req.user.username}, {$set: {wallet: user.wallet}}, {new: true}, (err, newUser) => {
                if (err) {
                    return res.sendStatus(500);
                }
                return res.sendStatus(200);
            });
        });

    });

    // Get a user's wallet from the database.
    app.get("/api/course", apiUtil.isLoggedIn, (req, res) => {
        Course.findOne({username: req.user.username}, (err, user) => {
            if (err) {
                // Server error.
                return res.sendStatus(500);
            }

            if (!user) {
                // No user to get wallet for.
                return res.sendStatus(400);
            }

            // Return user's wallet.
            res.status(200).send(JSON.stringify(user.wallet));
        });

    });

    function createCourse(courseData, csvData) {
        console.log(csvData)
    }

};
