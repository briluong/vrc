const apiUtil = require('./api_util');
const User = require('./models/user');
const Course = require('./models/courses');
const Lecture = require('./models/lectures');
const Papa = require('papaparse')

module.exports = function (app) {

    // API call to buy a currency
    app.post("/api/createCourse", apiUtil.isLoggedIn, (req, res) => {
        if (!req.body) {
            return res.sendStatus(400);
        }
        // Search for a user and update their wallet.
        var course = new Course();
        course.ownerId = req.user._id
        course.instructors = [{email: req.user.email, instructorName: req.user.firstName + " " + req.user.lastName}]
        course.title = req.body.newCourseName
        course.code = req.body.newCourseCode
        course.description = req.body.newCourseDescription
        course.instructorName = req.user.firstName + " " + req.user.lastName
        course.lectures = []
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
        course.save(function (err, data) {
            if (err) {
                throw err;
            }
            console.log(data)
            return res.sendStatus(200);
        });
    });

    app.post("/api/createLecture", apiUtil.isLoggedIn, (req, res) => {
        if (!req.body) {
            return res.sendStatus(400);
        }
        var lecture = new Lecture();
        lecture.ownerId = req.user._id;
        lecture.courseID = req.body.courseID;
        lecture.title = req.body.lectureName;
        lecture.active = false;
        lecture.available = false;
        lecture.save(function (err, data) {
            if (err) {
                throw err;
            }
            var lectureData = {
                "lectureID": data._id,
                "lectureTitle": data.title,
                "active": data.active,
                "createdOn": data.createdOn
            }
            console.log(lectureData)
            Course.findOneAndUpdate({"_id": data.courseID}, {$push: {'lectures': lectureData}}, function (err, data) {
                if (err) {
                    return res.sendStatus(500);
                }
                else {
                    return res.sendStatus(200);
                }
            })
        });
    });


    // API call to delete a course
    app.delete("/api/deleteCourse", apiUtil.isLoggedIn, (req, res) => {
        if (!req.body.courseID) {
            // No Course ID
            return res.sendStatus(400);
        }
        // Search user for which to sell the currency.
        Course.find({_id: req.body.courseID}).remove(function (err) {
            if (err) {
                return res.sendStatus(500);
            }
            else {
                return res.sendStatus(200);
            }
        })
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
