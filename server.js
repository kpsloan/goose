// Dependencies
var express = require("express");
var exphbs = require('express-handlebars');
var logger = require("morgan");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");


// Sets up Express App
var app = express();
var PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(logger("dev")); 




// Sets Handlebars default
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


// Routes
var routes = require('./routes/routes');
app.use('/', routes);

//Models
// var Article = require('./models/articles');
// var Comment = require('./models/comments');


// Database
mongoose.Promise = Promise;
var dbURI = process.env.MONGODB_URI || "mongodb://localhost:27017/technology";

mongoose.connect(dbURI, { useNewUrlParser: true });
var db = mongoose.connection;
db.on("error", function(error) {
    console.log("Mongoose Error: ", error);
});

db.once("open", function() {
    console.log("Mongoose connection successful.");
    // start the server, listen on port 3000
    app.listen(PORT, function() {
        console.log("App running on port" + PORT);
    });
});


