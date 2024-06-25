const express = require("express");
const router = express.Router();

router.use(function(req, res, next) {
    if(req.session.user) {
        next();
    } else {
        res.redirect("/login");
    }
});

router.get("/", function(req, res) {
    res.render("home", {title: "Home Page", active: "home", user: req.session.user});
});

module.exports = router;