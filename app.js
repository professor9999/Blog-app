var express = require("express");
var app = express();
var ejs = require("ejs");
var bodyparser = require("body-parser");
var mongoose = require("mongoose");

app.set('port', process.env.PORT || 3000);

mongoose.connect("mongodb://localhost/blogs", { useNewUrlParser: true, useUnifiedTopology: true });
var blogSchema = new mongoose.Schema({
    title: String,
    img: String,
    body: String,
    date: { type: Date, default: Date.now }
});
var Blog = mongoose.model("BlogPost", blogSchema);

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
    res.redirect("/blogs");
});

app.get("/blogs", function(req, res) {
    Blog.find({}, function(err, blogs) {
        res.render("home", { blogs: blogs });
    });
});

app.get("/blogs/new", function(req, res) {
    res.render("new");
});

app.post("/blogs", function(req, res) {
    var title = req.body.title;
    var image = req.body.image;
    var body = req.body.body;
    var object = { title: title, img: image, body: body, }
    Blog.create(object);
    res.redirect("/blogs");
});

app.get("/blogs/:id", function(req, res) {
    var id = req.params.id;
    Blog.findById(id, function(err, blog) {
        if (err) {
            res.send("<h2>ERROR 404 - Page not found</h2>");
        } else {
            res.render("show", { blog: blog });
        }
    });
});

app.get("/blogs/:id/edit", function(req, res) {
    var id = req.params.id;
    Blog.findById(id, function(err, blog) {
        if (err) {
            res.send("<h2>ERROR 404 - Page not found</h2>");
        } else {
            res.render("edit", { blog: blog });
        }
    });
});

app.post("/blogs/:id", function(req, res) {
    var title = req.body.title;
    var image = req.body.image;
    var body = req.body.body;
    var object = { title: title, img: image, body: body, }
    Blog.findByIdAndUpdate(req.params.id, object, function(err, updated) {
        if (err) {
            res.send("<h2>ERROR 404 - Page ot found");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

app.post("/blogs/:id/delete", function(req, res) {
    var id = req.params.id;
    Blog.findByIdAndRemove(id, function(err) {
        if (err) {
            res.send("<h2>ERROR 404 - Page not found");
        } else {
            res.redirect("/blogs");
        }
    });
});

app.get("*", function(req, res) {
    res.send("<h2>ERROR 404 - Page not found</h2>");
});

app.listen(3000, "127.0.0.1", function() {
    console.log("BLOG server started");
});