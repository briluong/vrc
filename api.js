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
            let students = req.body.file
            let enrolledStudents = []
            let groups = {}
            for (let i = 0; i < students.length; i++) {
                let entry = students[i]
                if (entry.hasOwnProperty('StudentID') && entry.hasOwnProperty('Group')) {
                    enrolledStudents.push(entry['StudentID'])
                    console.log(entry['Group'])
                    if (entry['Group'] in groups) {
                        groups[entry['Group']].push(entry['StudentID'])
                    }
                    else {
                        groups[entry['Group']] = [entry['StudentID']]
                    }
                }
                else if (entry.hasOwnProperty('StudentID')) {
                    enrolledStudents.push(entry['StudentID'])
                }
            }
            course.students = enrolledStudents;
            course.groups = groups
        }
        else {
            course.students = []
            course.groups = {}
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
        lecture.groupActive = false;
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

    app.post("/api/addInstructor", apiUtil.isLoggedIn, (req, res) => {
        if (!req.body) {
            console.log("Hi1")
            return res.sendStatus(400);
        }
        User.findOne({
            'email': req.body.instructorEmail, $and: [{'accountType': 'instructor'}]
        }, (function (err, data) {
            if (err) {
                console.log("Hi2")
                throw err;
            }
            if (req.user.email == req.body.instructorEmail) {
                console.log("Hi3")
                return res.sendStatus(400);
            }
            console.log("Hi4")
            var instructorData = {
                "email": data.email,
                "instructorName": data.firstName + " " + data.lastName
            }
            console.log("Hi5")
            console.log(instructorData)
            Course.findOneAndUpdate({"_id": req.body.courseID}, {$push: {'instructors': instructorData}}, function (err, data) {
                if (err) {
                    console.log("Hi6")
                    return res.sendStatus(500);
                }
                else {
                    return res.sendStatus(200);
                }
            })
        }));
    });

    // API call to remove an instructor from a course
    app.post("/api/removeInstructor", apiUtil.isLoggedIn, (req, res) => {
        if (!req.body.email) {
            // No Course ID
            return res.sendStatus(400);
        }
        Course.findOne({_id: req.body.courseID}, (function (err, course) {
            if (err) {
                return res.sendStatus(500);
            }
            else {
                var instructors = course.instructors
                for (var i = 0; i < instructors.length; i++) {
                    if (instructors[i].email == req.body.email) {
                        instructors.splice(i, 1);
                        break;
                    }
                }
                Course.findOneAndUpdate({"_id": req.body.courseID}, {$set: {'instructors': instructors}}, function (err, data) {
                    if (err) {
                        return res.sendStatus(500);
                    }
                    else {
                        return res.sendStatus(200);
                    }
                })
            }
        }))
    });

    app.post("/api/enrollStudents", apiUtil.isLoggedIn, (req, res) => {
        if (!req.body) {
            return res.sendStatus(400);
        }
        if ("file" in req.body) {
            let students = req.body.file
            let enrolledStudents = []
            let groups = {}
            for (let i = 0; i < students.length; i++) {
                let entry = students[i]
                if (entry.hasOwnProperty('StudentID') && entry.hasOwnProperty('Group')) {
                    enrolledStudents.push(entry['StudentID'])
                    console.log(entry['Group'])
                    if (entry['Group'] in groups) {
                        groups[entry['Group']].push(entry['StudentID'])
                    }
                    else {
                        groups[entry['Group']] = [entry['StudentID']]
                    }
                }
                else if (entry.hasOwnProperty('StudentID')) {
                    enrolledStudents.push(entry['StudentID'])
                }
            }
            Course.findOneAndUpdate({"_id": req.body.courseID}, {
                $set: {
                    'students': enrolledStudents,
                    'groups': groups
                }
            }, function (err, course) {
                if (err) {
                    return res.sendStatus(500);
                }
                else {
                    return res.sendStatus(200);
                }

            })
        }
        else {
            return res.sendStatus(200);
        }
    });

    app.post("/api/toggleActiveLecture", apiUtil.isLoggedIn, (req, res) => {
        if (!req.body) {
            return res.sendStatus(400);
        }
        Course.findOneAndUpdate({"lectures.lectureID": req.body.lectureID}, {
            '$set': {
                'lectures.$.active': req.body.active,
            }
        }, function (err, course) {
            if (err) {
                return res.sendStatus(500);
            }
            else {
                Lecture.findOneAndUpdate({"_id": req.body.lectureID}, {
                    $set: {
                        'active': req.body.active
                    }
                }, function (err, lecture) {
                    if (err) {
                        return res.sendStatus(500);
                    }
                    else {
                        return res.sendStatus(200);
                    }
                })
            }
        })
    });

    app.post("/api/toggleGroupActiveLecture", apiUtil.isLoggedIn, (req, res) => {
        if (!req.body) {
            return res.sendStatus(400);
        }
        Lecture.findOneAndUpdate({"_id": req.body.lectureID}, {
            $set: {
                'groupActive': req.body.groupActive
            }
        }, function (err, lecture) {
            if (err) {
                return res.sendStatus(500);
            }
            else {
                return res.sendStatus(200);
            }
        })
    });

    app.post("/api/updateYoutube", apiUtil.isLoggedIn, (req, res) => {
        if (!req.body) {
            return res.sendStatus(400);
        }
        Lecture.findOneAndUpdate({"_id": req.body.lectureID}, {
            $set: {
                'youtube': req.body.youtube
            }
        }, function (err, lecture) {
            if (err) {
                return res.sendStatus(500);
            }
            else {
                return res.sendStatus(200);
            }
        })
    });

    // API call to delete a course
    app.delete("/api/deleteCourse", apiUtil.isLoggedIn, (req, res) => {
        if (!req.body.courseID) {
            // No Course ID
            return res.sendStatus(400);
        }
        // Search user for which to sell the currency.
        Course.findOneAndRemove({_id: req.body.courseID}, function (err, course) {
            if (err) {
                return res.sendStatus(500);
            }
            else {
                console.log("Removing")
                console.log(course)
                let lectureIDs = []
                for (var i = 0; i < course.lectures.length; i++) {
                    lectureIDs.push(course.lectures[i].lectureID)
                }
                Lecture.find({_id: lectureIDs}).remove(function (err) {
                    if (err) {
                        return res.sendStatus(500);
                    }
                    else {
                        return res.sendStatus(200);
                    }
                })
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
