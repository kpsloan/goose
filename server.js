// Dependencies
var express = require("express");
var exphbs = require('express-handlebars');
var logger = require("morgan");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var Article = require('./models/articles.js');
var Comment = require('./models/comments.js');
var axios = require("axios");
var cheerio = require("cheerio");


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
// var routes = require('./routes/routes.js');
// app.use('/', routes);



// Database
mongoose.Promise = Promise;
var dbURI = process.env.MONGODB_URI || "mongodb://localhost:27017/technology";

mongoose.connect(dbURI, { useNewUrlParser: true });
var db = require("./models");

app.get("/", function(req, res) {
	db.Article.find({}, null, {sort: {created: -1}}, function(err, data) {
		if(data.length === 0) {
			res.render("placeholder", {message: "Press the button for most recent articles or enter a new search term."});
		}
		else{
			res.render("index", {articles: data});
		}
	});
});

app.get("/scrape", function(req, res) {
	axios.get("https://www.nytimes.com/section/technology", function(error, response, html) {
		var $ = cheerio.load(html);
		var result = {};
		$("div.story-body").each(function(i, element) {
			var link = $(element).find("a").attr("href");
			var title = $(element).find("h2.headline").text().trim();
			var summary = $(element).find("p.summary").text().trim();
			var img = $(element).parent().find("figure.media").find("img").attr("src");
			result.link = link;
			result.title = title;
			if (summary) {
				result.summary = summary;
			};
			if (img) {
				result.img = img;
			}
			else {
				result.img = $(element).find(".wide-thumb").find("img").attr("src");
			};
			var entry = new Article(result);
			db.Article.find({title: result.title}, function(err, data) {
				if (data.length === 0) {
					entry.save(function(err, data) {
						if (err) throw err;
					});
				}
			});
		});
		console.log("Scrape complete.");
		res.redirect("/");
	});
});

app.get("/saved", function(req, res) {
	db.Article.find({issaved: true}, null, {sort: {created: -1}}, function(err, data) {
		if(data.length === 0) {
			res.render("placeholder", {message: "Save an article to view."});
		}
		else {
			res.render("saved", {saved: data});
		}
	});
});

app.get("/:id", function(req, res) {
	Article.findById(req.params.id, function(err, data) {
		res.json(data);
	})
})

app.post("/search", function(req, res) {
	console.log(req.body.search);
	Article.find({$text: {$search: req.body.search, $caseSensitive: false}}, null, {sort: {created: -1}}, function(err, data) {
		console.log(data);
		if (data.length === 0) {
			res.render("placeholder", {message: "No results. Try another search."});
		}
		else {
			res.render("search", {search: data})
		}
	})
});

app.post("/save/:id", function(req, res) {
	Article.findById(req.params.id, function(err, data) {
		if (data.issaved) {
			Article.findByIdAndUpdate(req.params.id, {$set: {issaved: false, status: "Save Article"}}, {new: true}, function(err, data) {
				res.redirect("/");
			});
		}
		else {
			Article.findByIdAndUpdate(req.params.id, {$set: {issaved: true, status: "Saved"}}, {new: true}, function(err, data) {
				res.redirect("/saved");
			});
		}
	});
});

app.post("/comment/:id", function(req, res) {
	var comment = new Comment(req.body);
	comment.save(function(err, doc) {
		if (err) throw err;
		Article.findByIdAndUpdate(req.params.id, {$set: {"comment": doc._id}}, {new: true}, function(err, newdoc) {
			if (err) throw err;
			else {
				res.send(newdoc);
			}
		});
	});
});

app.get("/comment/:id", function(req, res) {
	var id = req.params.id;
	Article.findById(id).populate("comment").exec(function(err, data) {
		res.send(data.comment);
	})
})


// db.on("error", function(err) {
//     console.log("Mongoose Error: ", err);
// });

// db.once("open", function() {
//     console.log("Mongoose connection successful.");
// });



// start the server, listen on port 3000
app.listen(PORT, function() {
    console.log("App running on port " + PORT);
});

