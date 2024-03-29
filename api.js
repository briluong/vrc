const apiUtil = require('./api_util');
const User = require('./models/user');
const Course = require('./models/courses');
const Lecture = require('./models/lectures');
const Question = require('./models/questions');
const Feedback = require('./models/feedback');
const Papa = require('papaparse')

module.exports = function (app) {

    // API call to buy a currency
    app.post("/api/createCourse", apiUtil.isLoggedIn, (req, res) => {
        if (!req.body) {
            return res.sendStatus(400);
        }
        Course.findOne({'code': req.body.newCourseCode}, function (err, course) {
            if(err){
                return res.sendStatus(500);
            }
            if(course){
                req.flash('create_course', 'There is already a class with this course code. Please try again.')
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
            if ("file" in req.body) {
                let students = req.body.file
                let enrolledStudents = []
                let groups = {}
                for (let i = 0; i < students.length; i++) {
                    let entry = students[i]
                    if (entry.hasOwnProperty('StudentID') && entry.hasOwnProperty('Group')) {
                        enrolledStudents.push(entry['StudentID'])
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
                return res.sendStatus(200);
            });
        })
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
            return res.sendStatus(400);
        }
        User.findOne({
            'email': req.body.instructorEmail, $and: [{'accountType': 'instructor'}]
        }, (function (err, data) {
            if (err) {
                return res.sendStatus(400);
            }
            if (req.user.email == req.body.instructorEmail) {
                return res.sendStatus(400);
            }
            if (!data) {
                return res.sendStatus(400);
            }
            var instructorData = {
                "email": data.email,
                "instructorName": data.firstName + " " + data.lastName
            }
            Course.findOneAndUpdate({"_id": req.body.courseID}, {$push: {'instructors': instructorData}}, function (err, data) {
                if (err) {
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

    app.delete("/api/deleteLecture", apiUtil.isLoggedIn, (req, res) => {
        if (!req.body) {
            return res.sendStatus(400);
        }
        Lecture.findOneAndRemove({_id: req.body.lectureID}, function (err, lecture) {
            if (err) {
                return res.sendStatus(500);
            }
            else {
                Course.findOneAndUpdate({ _id: req.body.courseID },
                    { "$pull": { "lectures": { "lectureID": req.body.lectureID }}},
                    { safe: true, multi:true }, function(err, course) {
                    if (err) {
                        req.flash('lecture', "Lecture was not successfully deleted!")
                        return res.sendStatus(500);
                    }
                    else {
                        req.flash('lecture', "Lecture was successfully deleted!")
                        return res.sendStatus(200);
                    }
                })
            }
        })
    })

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

    app.post("/api/toggleNotifications", apiUtil.isLoggedIn, (req, res) => {
        if (!req.body) {
            return res.sendStatus(400);
        }
        Lecture.findOneAndUpdate({"_id": req.body.lectureID}, {
            $set: {
                'notifications': req.body.notifications
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

    app.post("/api/changeSettings", apiUtil.isLoggedIn, (req, res) => {
        if (!req.body) {
            return res.sendStatus(400);
        }
        User.findOneAndUpdate({"_id": req.user._id}, {
            $set: {
                'lastName': req.body.lastName,
                'firstName': req.body.firstName
            }
        }, function (err, user) {
            if (err) {
                req.flash('settings', "Changes were not successful! Please try again.")
                return res.sendStatus(500);
            }
            else {
                req.flash('settings', "Changes were successful!")
                return res.sendStatus(200);
            }
        })
    });

    app.post("/api/changePassword", apiUtil.isLoggedIn, (req, res) => {
        if (!req.body) {
            return res.sendStatus(400);
        }
        User.findOne({"_id": req.user._id}, function (err, user) {
            if(err){
                req.flash('settings', "Changes were not successful! Please try again.")
                return res.sendStatus(500);
            }
            if(!(user.validPassword(req.body.currentPassword))){
                req.flash('settings', "Current password did not match")
                return res.sendStatus(200);
            }
            var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
            if(!(passwordRegex.test(req.body.newPassword)) && !(passwordRegex.test(req.body.newPasswordConfirm))){
                req.flash('settings', "Password must be minimum eight characters, at least one uppercase letter, one lowercase letter and one number.")
                return res.sendStatus(200);
            }

            if(req.body.newPassword != req.body.newPasswordConfirm) {
                req.flash('settings', "New password did not match")
                return res.sendStatus(200);
            }

            else{
                User.findOneAndUpdate({"_id": req.user._id}, {
                    $set: {
                        'password': user.generateHash(req.body.newPassword),
                    }
                }, function (err, user) {
                    if (err) {
                        req.flash('settings', "Changes were not successful! Please try again.")
                        return res.sendStatus(500);
                    }
                    else {
                        req.flash('settings', "Password Successfully Changed!")
                        return res.sendStatus(200);
                    }
                })
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

    //edit the course description
    app.post("/api/course/editDescription", apiUtil.isLoggedIn, (req, res) => {
        if (!req.body) {
            return res.sendStatus(400);
        }
        console.log("TEST")
        console.log(req.body.courseID)
        console.log(req.body.courseDescription)

        Course.findOneAndUpdate({"_id": req.body.courseID}, {
            $set: {
                'description': req.body.courseDescription
            }

            }, function (err, course) {
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
                if(course.lectures.length > 0) {
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
                else{
                    return res.sendStatus(200);
                }
            }
        })
    });

    app.delete("/api/deleteQuestion", apiUtil.isLoggedIn, (req, res) => {
        if (!req.body.questionID) {
            // No Course ID
            return res.sendStatus(400);
        }
        console.log(req.body.questionID)
        // Search user for which to sell the currency.
        Question.findOneAndRemove({_id: req.body.questionID}, function (err, question) {
            if (err) {
                return res.sendStatus(500);
            }
            else {
                return res.sendStatus(200);
            }
        })
    });

    app.delete("/api/deleteFeedback", apiUtil.isLoggedIn, (req, res) => {
        if (!req.body.feedbackID) {
            // No Course ID
            return res.sendStatus(400);
        }
        console.log(req.body.feedbackID)
        // Search user for which to sell the currency.
        Feedback.findOneAndRemove({_id: req.body.feedbackID}, function (err, feedback) {
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
