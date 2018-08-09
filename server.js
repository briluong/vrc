/**
 * Created by MichaelWang on 2018-07-08.
 */
var express = require('express');

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const morgan = require("morgan");

const mongoose = require('mongoose');
const session = require("express-session");
const passport = require("passport");

var http = require("http");              // http server core module
var serveStatic = require('serve-static');  // serve static files
var socketIo = require("socket.io");        // web socket external module
var easyrtc = require("easyrtc");
var flash = require('connect-flash');
const dbConfig = require("./config/database.js");
const Lecture = require('./models/lectures');
const Course = require('./models/courses');
const Help = require('./models/help_request');
const InstructorQuestion = require('./models/instructor_question');
const InstructorFile = require('./models/instructor_file');

const app = express();

const PORT = process.env.PORT || 3001;
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
});
app.use(express.static("public"));
app.use(flash());
/*function defaultContentTypeMiddleware (req, res, next) {
 req.headers['content-type'] = req.headers['content-type'] || 'application/json';
 next();
 }*/

// app.use(defaultContentTypeMiddleware);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
//app.use(bodyParser());
app.use(cookieParser('secret'));
app.use(morgan("dev"));

app.use(methodOverride("_method"));

app.use(session({
    secret: "vrc",
    resave: false,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");

// Import routes
require("./api.js")(app);
require("./config/passport.js")(passport);
require("./routes/routes.js")(app, passport);

var webServer = http.createServer(app)
var socketServer = socketIo.listen(webServer, {"log level": 1});

socketServer.on('connection', function (socket) {
    socket.on("instructorQuestion", function (data) {
        InstructorQuestion.findOneAndUpdate({"lectureID": data.lectureID}, {
            '$set': {
                'question': data.question,
            }
        }, function (err, question) {
            if (err) {
                throw err;
            }
            else if (question) {
                socketServer.sockets.emit(data.lectureID + "-instructorQuestion", data)
            }
            else {
                var instructorQuestion = new InstructorQuestion();
                instructorQuestion.lectureID = data.lectureID
                instructorQuestion.question = data.question
                instructorQuestion.save(function (err, instructorQuestion) {
                    if (err) {
                        throw err;
                    }
                    else {
                        console.log(instructorQuestion)
                        socketServer.sockets.emit(data.lectureID + "-instructorQuestion", data)
                    }
                })
            }
        })
    })

    socket.on("instructorFile", function (data) {
        var buf = Buffer.from(data.file, 'base64');
        InstructorFile.findOneAndUpdate({"lectureID": data.lectureID}, {
            '$set': {
                'data': buf,
                'fileType': data.fileType
            }
        }, function (err, question) {
            if (err) {
                throw err;
            }
            else if (question) {
                socketServer.sockets.emit(data.lectureID + "-instructorFile", data)
            }
            else {
                var instructorFile = new InstructorFile();
                instructorFile.lectureID = data.lectureID
                instructorFile.data = buf
                instructorFile.fileType = data.fileType
                instructorFile.save(function (err, instructorFile) {
                    if (err) {
                        throw err;
                    }
                    else {
                        console.log(instructorFile)
                        socketServer.sockets.emit(data.lectureID + "-instructorFile", data)
                    }
                })
            }
        })
    })

    socket.on("updateYoutube", function (data) {
        Lecture.findOneAndUpdate({"_id": data.lectureID}, {
            $set: {
                'youtube': data.youtube
            }
        }, function (err, lecture) {
            if (err) {
                throw err;
            }
            else {
                socketServer.sockets.emit(data.lectureID + "-updateYoutube", data)
            }
        })
    })

    socket.on('help', function (data) {
        Help.findOne({'lectureID': data.lectureID, 'groupName': data.groupName}, function (err, help) {
            // Return any errors.
            if (err) {
                throw err;
            }

            // Return if the user does not exist.
            if (!help) {
                var help = new Help()
                help.lectureID = data.lectureID;
                help.value = data.value;
                help.groupName = data.groupName;
                help.save(function (err, feed) {
                    if (err) {
                        throw err;
                    }
                    else {
                        console.log(data)
                        data["_id"] = help._id
                        socketServer.sockets.emit(data.lectureID + "-Help", data);
                    }
                });
            }
            else {
                Help.findOneAndRemove({'lectureID': data.lectureID, 'groupName': data.groupName}, function (err, help) {
                    if (err) {
                        throw err;
                    }
                    else {
                        socketServer.sockets.emit(data.lectureID + "-DeleteHelp", data);
                    }
                })
            }

        });
    });
    socket.on('feedback', function (data) {
        var feed = new Feedback()
        feed.lectureID = data.lectureID;
        feed.value = data.value;
        feed.sentBy = data.sentBy;
        console.log("send feedback");
        feed.save(function (err, feed) {
            if (err) {
                throw err;
            }
            else {
                console.log(data)
                data["_id"] = feed._id
                data['createdAt'] = feed.createdAt
                socketServer.sockets.emit(data.lectureID, data);
            }
        });

    });
    socket.on('chat message', function (data) {
        var audio = new Questions()
        console.log(data.questionType)
        if (data.questionType == 'audio') {
            var buf = Buffer.from(data.data, 'base64'); // Ta-da
            console.log(buf)
            audio = new Questions()
            audio.size = data.Size
            audio.confidence = data.confidence
            audio.name = data.Name
            audio.sentBy = data.Username
            audio.data = buf
            audio.lectureID = data.lectureID
            audio.questionType = 'audio'
            audio.text = data.text
            audio.save(function (err, audio) {
                if (err) {
                    throw err;
                }
                else {
                    data["_id"] = audio._id
                    data["createdAt"] = audio.createdAt
                    socketServer.sockets.emit(data.lectureID, data);
                }
            });
        }
        else {
            audio = new Questions()
            audio.size = null
            audio.confidence = data.confidence
            audio.name = null
            audio.sentBy = data.Username
            audio.data = null
            audio.lectureID = data.lectureID
            audio.questionType = 'text'
            audio.text = data.text
            audio.save(function (err, audio) {
                if (err) {
                    throw err;
                }
                else {
                    console.log(data)
                    data["_id"] = audio._id
                    socketServer.sockets.emit(data.lectureID, data);
                }
            });
        }
    });
    socket.on("toggleActiveLecture", function (data) {
        if ("active" in data && "lectureID" in data && "courseID" in data) {
            console.log(data)
            Course.findOneAndUpdate({"lectures.lectureID": data.lectureID}, {
                '$set': {
                    'lectures.$.active': data.active,
                }
            }, function (err, course) {
                if (err) {
                    throw err;
                }
                else {
                    Lecture.findOneAndUpdate({"_id": data.lectureID}, {
                        $set: {
                            'active': data.active
                        }
                    }, function (err, lecture) {
                        if (err) {
                            throw err;
                        }
                        else {
                            socketServer.sockets.emit(data.lectureID + "-lectureToggle", data);
                        }
                    })
                }
            })
        }
    })
    socket.on("toggleGroupActiveLecture", function (data) {
        Lecture.findOneAndUpdate({"_id": data.lectureID}, {
            $set: {
                'groupActive': data.groupActive
            }
        }, function (err, lecture) {
            if (err) {
                throw err;
            }
            else {
                socketServer.sockets.emit(data.lectureID + "-groupToggle", data);
            }
        })
    })
});

var myIceServers = [
    {"url": "stun:stun.l.google.com:19302"},
    {"url": "stun:stun1.l.google.com:19302"},
    {"url": "stun:stun2.l.google.com:19302"},
    {"url": "stun:stun3.l.google.com:19302"}
    // {
    //   "url":"turn:[ADDRESS]:[PORT]",
    //   "username":"[USERNAME]",
    //   "credential":"[CREDENTIAL]"
    // },
    // {
    //   "url":"turn:[ADDRESS]:[PORT][?transport=tcp]",
    //   "username":"[USERNAME]",
    //   "credential":"[CREDENTIAL]"
    // }
];
easyrtc.setOption("appIceServers", myIceServers);
easyrtc.setOption("logLevel", "debug");
easyrtc.setOption("demosEnable", false);

// Overriding the default easyrtcAuth listener, only so we can directly access its callback
easyrtc.events.on("easyrtcAuth", function (socket, easyrtcid, msg, socketCallback, callback) {
    easyrtc.events.defaultListeners.easyrtcAuth(socket, easyrtcid, msg, socketCallback, function (err, connectionObj) {
        if (err || !msg.msgData || !msg.msgData.credential || !connectionObj) {
            callback(err, connectionObj);
            return;
        }

        connectionObj.setField("credential", msg.msgData.credential, {"isShared": false});

        console.log("[" + easyrtcid + "] Credential saved!", connectionObj.getFieldValueSync("credential"));

        callback(err, connectionObj);
    });
});

// To test, lets print the credential to the console for every room join!
easyrtc.events.on("roomJoin", function (connectionObj, roomName, roomParameter, callback) {
    console.log("[" + connectionObj.getEasyrtcid() + "] Credential retrieved!", connectionObj.getFieldValueSync("credential"));
    easyrtc.events.defaultListeners.roomJoin(connectionObj, roomName, roomParameter, callback);
});


// Start EasyRTC server
var rtc = easyrtc.listen(app, socketServer, null, function (err, rtcRef) {
    console.log("Initiated");

    rtcRef.events.on("roomCreate", function (appObj, creatorConnectionObj, roomName, roomOptions, callback) {
        console.log("roomCreate fired! Trying to create: " + roomName);

        appObj.events.defaultListeners.roomCreate(appObj, creatorConnectionObj, roomName, roomOptions, callback);
    });
});


const Questions = require('./models/questions');
const Feedback = require('./models/feedback');

// // Uploading Questions
// app.post("/api/uploadAudio", apiUtil.isLoggedIn, (req, res) => {
//     if (!req.body) {
//         return res.sendStatus(400);
//     }
//     var buf = Buffer.from(req.body.data, 'base64'); // Ta-da
//     var audio = new Questions()
//     audio.size = req.body.Size
//     audio.name = req.body.Name
//     audio.sentBy = req.body.Username
//     audio.data = buf
//     audio.lectureID = req.body.lectureID
//     audio.save(function (err, data) {
//         if (err) {
//             throw err;
//         }
//         console.log(data)
//         return res.sendStatus(200);
//     });
// });

// Listen to port 5000

webServer.listen(PORT, function () {
    console.log('App listening on port ' + PORT + "!");
});
