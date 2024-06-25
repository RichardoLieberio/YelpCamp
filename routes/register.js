const express = require("express");
const Users = require("../models/users.js");
const router = express.Router();

router.get("/", function(req, res) {
    res.render("register", {errors: req.flash("errors")[0], data: req.flash("data")[0], emailRegistered: req.flash("emailRegistered")[0], pwdError: req.flash("pwdError")[0]});
});

router.post("/", async function(req, res) {
    try {
        const newUser = await new Users(req.body);
        await newUser.validate();

        if(await Users.findEmail(req.body.email)) {
            req.flash("emailRegistered", "Email has been registered");
            throw new Error();
        }
        if(req.body.pwd !== req.body.confirm_pwd) {
            req.flash("pwdError", "Password does not match");
            throw new Error();
        }
        await newUser.save();
        req.flash("message", "You have successfully registered");
        res.redirect("login");
    } catch(err) {
        if(err.name === "ValidationError") {
            const errors = {};
            Object.keys(err.errors).forEach(function(key) {
                errors[key] = err.errors[key].message;
            });
            req.flash("errors", errors);
        }
        req.flash("data", req.body);
        res.redirect("register");
    }
});

module.exports = router;