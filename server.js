var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var Comments = require(".models/Comments.js");
var Article = require("./models/Articles.js");
var request = require("request");
var cheerio = require("cheerio");

mongoose.Promise = Promise;

var app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static("public"));

mongoose.connet("http://www.theonion.com/section/entertainment/");
var db = mongoose.connection;

db.on("error", function(error) {
    console.log("Mongoose Error: ", error);
});

db.once("open", function() {
    console.log("Success!!!!");
});

app.get("/scrape", function(req, res) {
    request("www.theonion.com/section/entertainment/", function(error, res, html) {
        var $ = cheerio.load(html);
        $("article summary").each(function(i, element) {
            var result = {};
            result.title = $(this).children("a").text();
            result.link = $(this).children("a").attr("href");
            var entry = new Article(result);
            entry.save(function(err, doc) {
                if (err) {
                    console.log(err);
                  } else{
                        console.log(doc);
                    }

            })
        })
    });
    res.send("Done!")
});

app.get("/articles", function(req, res) {
    Article.find({}, function(error, doc) {
        if (error) {
            console.log(error);
        } else {
            res.json(doc);
        }
    });
});

app.get("/article/:id", function(req, res) {
    var newComment = new Comment(req.body);
    newComment.save(funtion(error, doc) {
        if (error) {
            console.log(error);
        } else {
            Article.findOneAndUpdate({
                    "_id": req.params.id
                }, {
                    "note": doc._id
                })
                .exec(function(err, doc) {
                    if (err) {
                        console.log(error);
                    } else {
                        res.send(doc);
                    }
                });
        })
    });
});

app.listen(3000, function() {
    console.log("Running!")
});
