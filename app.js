//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const aboutContent = "The idea behind INCOGNITO was inspired by the developer's interactions with individuals who suffer from varying degrees of mental health issues, who then wanted to provide a safe space for these individuals to voice their thoughts and opinions without having the fear of being identified while also providing a comfortable environment with other individuals who are also dealing with mental health issues.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
let posts = [];
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.render("home", {posts: posts});
});

app.get("/about/", function(req, res) {
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res) {
  res.render("contact", {contactContent: contactContent});
});

app.get("/post", function(req, res) {
  res.render("compose");
});

app.post("/compose", function(req, res) {
  const post = {
    title: _.lowerCase(req.body.postTitle),
    body: req.body.postBody,
    time: new Date(),
    comments: []
  };
  posts.push(post);
  res.redirect("/");
});

app.get("/posts/:postId", function(req, res) {
  let post = posts.find(function(elem) {
    return elem.title.toLowerCase() === _.lowerCase(req.params.postId);
  });
  if (post === undefined) {
    res.redirect("/");
  } else {
      res.render("post", {post: post, comments: post.comments});
  }
});

app.post("/posts/:postId", function(req, res) {
  let comment = {
    author: req.body.commentAuthor,
    body: req.body.commentBody
  }
  let post = posts.find(function(elem) {
    if (elem.title.toLowerCase() === _.lowerCase(req.params.postId)) {
      elem.comments.push(comment);
      return elem;
    }
  });
  res.redirect("/posts/" + req.params.postId);
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
