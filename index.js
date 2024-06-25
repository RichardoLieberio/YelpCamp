const express = require("express");
const session = require("express-session");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const path = require("path");
const {v4: uuidv4} = require("uuid");
const flash = require("connect-flash");
const app = express();

const loginRouter = require("./routes/login.js");
const registerRouter = require("./routes/register.js");
const logoutRouter = require("./routes/logout.js");
const homeRouter = require("./routes/home.js");
const campgroundsRouter = require("./routes/campgrounds.js");

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/css", express.static(path.join(__dirname, "src/css")));
app.use("/js", express.static(path.join(__dirname, "src/js")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended: true}));
app.use(flash());

app.use(session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 5
    }
}));

app.use("/login", loginRouter);
app.use("/register", registerRouter);
app.use("/logout", logoutRouter);
app.use("/campgrounds", campgroundsRouter);
app.use("/home", homeRouter);

app.get("*", function(req, res) {
    if(req.session.user) {
        res.redirect("home");
    } else {
        res.redirect("login");
    }
});

app.use(function(err, req, res, next) {
    res.render("error", {title: `YelpCamp Error ${err.statusCode}`, active: "", error: err});
});

app.listen(3000, function() {
    console.log("Listening on port 3000");
});