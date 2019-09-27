//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const _ = require("lodash");
const app = express();
const aboutContent = "The idea behind INCOGNITO was inspired by the developer's interactions with individuals who suffer from varying degrees of mental health issues, who then wanted to provide a safe space for these individuals to voice their thoughts and opinions anonymously, removing the fear and stigma attached with mental health while also providing a comfortable space and environment with other individuals dealing with mental health issues.";
let posts = [];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/postList", { useNewUrlParser: true, useUnifiedTopology: true });

const postsSchema = new mongoose.Schema({
  title: String,
  body: String,
  date: String,
  comments: []
});

const Post = mongoose.model("Post", postsSchema);

const sample = [{
  title: "This is what a sample post will look like",
  body: "To begin posting, click the start posting button above!",
  date: String(new Date())
}];

app.get("/", function(req, res) {
  Post.find({}, function(err, foundPosts) {
    if (foundPosts.length === 0) {
      res.render("home", { posts: sample });
    } else {
      console.log("Found posts");
      res.render("home", { posts: foundPosts });
    }
  });
});

app.get("/about/", function(req, res) {
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res) {
  res.render("contact");
});

app.get("/post", function(req, res) {
  res.render("compose");
});

app.post("/compose", function(req, res) {
  const newPost = new Post({
    title: _.lowerCase(req.body.postTitle),
    body: req.body.postBody,
    date: String(new Date()),
    comments: []
  });
  newPost.save();
  res.redirect("/");
});

app.get("/posts/:postId", function(req, res) {
  const postTitle = _.lowerCase(req.params.postId);
  Post.findOne({title: postTitle}, function(err, foundPost) {
    if (!err) {
      if (!foundPost) {
        res.redirect("/");
      } else {
        res.render("post", {post: foundPost, comments: foundPost.comments});
      }
    } else {
      console.log(err);
    }
  });
});

app.post("/posts/:postId", function(req, res) {
  const postTitle = _.lowerCase(req.params.postId);
  console.log(postTitle);
  let comment = {
    author: req.body.commentAuthor,
    body: req.body.commentBody
  }
  Post.findOne({title: postTitle}, function(err, foundPost) {
    if (!err) {
      if (foundPost) {
        console.log("Found post");
        foundPost.comments.push(comment);
        foundPost.save();
        res.redirect("/posts/" + req.params.postId);
      }
    } else {
        console.log(err);
      }
  });
});

app.get('*', function(req, res){
  res.render("pageNotFound");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
