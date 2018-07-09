/**
 * Created by MichaelWang on 2018-07-08.
 */
var express = require('express');
var app = express();
const PORT = process.env.PORT || 3001;

// Our first route
app.use(express.static("public"));
app.set("view engine", "ejs");

// Import routes
require("./routes/routes.js")(app);
// Listen to port 5000
app.listen(PORT, function () {
    console.log('App listening on port ' + PORT + "!");
});