var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var Comment = require("./models/Comment.js");
var Article = require("./models/Article.js");

var request = require("request");

var cheerio = require("cheerio");

var exphbs = require('express-handlebars');

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "index" }));
app.set("view engine", "handlebars");
mongoose.Promise = Promise;


var app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost/onion");
var db = mongoose.connection;

db.on("error", function(error) {
    console.log("Mongoose Error: ", error);
});

db.once("open", function() {
    console.log("SUCCESS");
});


//scrapes from the onion
app.get("/scrape", function(req, res) {
    request('http://www.theonion.com/section/entertainment/', function(error, response, html) {
        var $ = cheerio.load(html);
        $("article.summary").each(function(i, element) {
            var result = {};
            // this is the link:
            result.link = $(this).children('a').attr('href');
            // this is the image:
            result.image = $(this).children('div.info').children('figure.thumb').children().children().children().children().attr('src');
            // this is the title:
            result.title = $(this).children('div.info').children('div.inner').children('header').children().children().attr('title');
            console.log(result);
            var entry = new Article(result);
            entry.save(function(err, doc) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(doc);
                }
            })
        })
    }) //request
    // Tell the browser that we finished scraping the text
    res.send("Scrape Complete");
});

//searches through artciles for results
app.get("/articles", function(req, res) {
    Article.find({}, function(error, doc) {
        if (error) {
            console.log(error);
        }
        else {
            res.json(doc);
        }
    });
});

// takes in artcile
app.get("/articles/:id", function(req, res) {
    Article.findOne({
            "_id": req.params.id
        })
        .populate("comment")
        .exec(function(error, doc) {
            if (error) {
                console.log(error);
            }
            else {
                res.json(doc);
            }
        });
});


app.post("/articles/:id", function(req, res) {
    var newComment = new Comment(req.body);
    newComment.save(function(error, doc) {
        if (error) {
            console.log(error);
        }
        else {
            Article.findOneAndUpdate({
                    "_id": req.params.id
                }, {
                    "comment": doc._id
                })
                .exec(function(err, doc) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.send(doc);
                    }
              });
        }
    });
});


// Listen on port 3000
app.listen(3000, function() {
    console.log("App running on port 3000!");
});
