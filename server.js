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

var http    = require("http");              // http server core module
var serveStatic = require('serve-static');  // serve static files
var socketIo = require("socket.io");        // web socket external module
var easyrtc = require("easyrtc");

const dbConfig = require("./config/database.js");

const app = express();

const PORT = process.env.PORT || 3001;
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
});
app.use(express.static("public"));

/*function defaultContentTypeMiddleware (req, res, next) {
 req.headers['content-type'] = req.headers['content-type'] || 'application/json';
 next();
 }*/

// app.use(defaultContentTypeMiddleware);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
//app.use(bodyParser());
app.use(cookieParser());
app.use(morgan("dev"));

app.use(methodOverride("_method"));

app.use(session({
    secret: "vrc",
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");

// Import routes
require("./api.js")(app);
require("./config/passport.js")(passport);
require("./routes/routes.js")(app, passport);

var webServer = http.createServer(app)
var socketServer = socketIo.listen(webServer, {"log level":1});

var myIceServers = [
    {"url":"stun:stun.l.google.com:19302"},
    {"url":"stun:stun1.l.google.com:19302"},
    {"url":"stun:stun2.l.google.com:19302"},
    {"url":"stun:stun3.l.google.com:19302"}
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
easyrtc.events.on("easyrtcAuth", function(socket, easyrtcid, msg, socketCallback, callback) {
    easyrtc.events.defaultListeners.easyrtcAuth(socket, easyrtcid, msg, socketCallback, function(err, connectionObj){
        if (err || !msg.msgData || !msg.msgData.credential || !connectionObj) {
            callback(err, connectionObj);
            return;
        }

        connectionObj.setField("credential", msg.msgData.credential, {"isShared":false});

        console.log("["+easyrtcid+"] Credential saved!", connectionObj.getFieldValueSync("credential"));

        callback(err, connectionObj);
    });
});

// To test, lets print the credential to the console for every room join!
easyrtc.events.on("roomJoin", function(connectionObj, roomName, roomParameter, callback) {
    console.log("["+connectionObj.getEasyrtcid()+"] Credential retrieved!", connectionObj.getFieldValueSync("credential"));
    easyrtc.events.defaultListeners.roomJoin(connectionObj, roomName, roomParameter, callback);
});


// Start EasyRTC server
var rtc = easyrtc.listen(app, socketServer, null, function(err, rtcRef) {
    console.log("Initiated");

    rtcRef.events.on("roomCreate", function(appObj, creatorConnectionObj, roomName, roomOptions, callback) {
        console.log("roomCreate fired! Trying to create: " + roomName);

        appObj.events.defaultListeners.roomCreate(appObj, creatorConnectionObj, roomName, roomOptions, callback);
    });
});
// Listen to port 5000

webServer.listen(PORT, function () {
    console.log('App listening on port ' + PORT + "!");
});