const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const path = require("path");
const campgroundsRouter = require("./routes/campgrounds.js");
const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/css", express.static(path.join(__dirname, "src/css")));
app.use("/js", express.static(path.join(__dirname, "src/js")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended: true}));

app.use("/campgrounds", campgroundsRouter);

app.get("/", function(req, res) {
    res.render("home", {title: "Home Page", active: "home"});
});

app.use(function(err, req, res, next) {
    res.render("error", {title: `YelpCamp Error ${err.statusCode}`, active: "", error: err});
});

app.listen(3000, function() {
    console.log("Listening on port 3000");
});