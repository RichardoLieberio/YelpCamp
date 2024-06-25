const express = require("express");
const Users = require("../models/users.js");
const router = express.Router();

router.get("/", function(req, res) {
    if(req.session.user) {
        res.redirect("home");
    }
    res.render("login", {message: req.flash("message")[0], invalid: req.flash("invalid")[0]});
});

router.post("/", async function(req, res) {
    const user = await Users.findAndValidate(req.body.email, req.body.pwd);
    if(user) {
        if(req.body.remember_me) {
            req.session.cookie.maxAge = 1000 * 60 * 30;
        }
        req.session.user = user;
        res.redirect("home");
    } else {
        req.flash("invalid", "Invalid email or password");
        res.redirect("login");
    }
});

module.exports = router;