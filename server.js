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
require("./config/passport.js")(passport);
require("./routes/routes.js")(app, passport);
// Listen to port 5000
app.listen(PORT, function () {
    console.log('App listening on port ' + PORT + "!");
});