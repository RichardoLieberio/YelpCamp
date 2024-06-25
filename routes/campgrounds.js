const express = require("express");
const ErrorHandler = require("../utils/error-handler.js");
const router = express.Router();

const Users = require("../models/users.js");
const Campgrounds = require("../models/campgrounds.js");
const Reviews = require("../models/reviews.js");

router.use(function(req, res, next) {
    if(req.session.user) {
        next();
    } else {
        res.redirect("/login");
    }
})

router.get("/", async function(req, res, next) {
    try {
        const campgrounds = await Campgrounds.find();
        campgrounds.reverse();
        res.render("campgrounds", {title: "All Campgrounds", active: "campgrounds", campgrounds, user: req.session.user});
    } catch(err) {
        next(new ErrorHandler());
    }
});

router.post("/", async function(req, res, next) {
    try {
        const campground = await new Campgrounds({authorId: req.session.user._id, ...req.body}).save();
        const user = await Users.findById(req.session.user._id);
        await user.campgroundsId.push(campground._id);
        await user.save();
        res.redirect("campgrounds");
    } catch(err) {
        if(err.name === "ValidationError") {
            const errors = Object.keys(err.errors).map(function(key) {
                if(err.errors[key].name === "CastError" && err.errors[key].path === "price") {
                    return "Price must be number";
                }
                return err.errors[key].message;
            });
            next(new ErrorHandler(400, "Bad Request", errors));
        }
        next(new ErrorHandler());
    }
});

router.get("/add", function(req, res) {
    res.render("add", {title: "Add New Campground", active: "add", user: req.session.user});
});

router.get("/:id", async function(req, res, next) {
    try {
        const campground = await Campgrounds.findById(req.params.id).populate("reviewsId");
        res.render("details", {title: "Campground Details", active: "campgrounds", campground, user: req.session.user});
    } catch(err) {
        next(new ErrorHandler(404, "Not Found", `Can't find campground with id: ${req.params.id}`));
    }
});

router.put("/:id", async function(req, res, next) {
    try {
        const campground = await Campgrounds.findByIdAndUpdate(req.params.id, req.body);
        res.redirect(`/campgrounds/${req.params.id}`);
    } catch(err) {
        if(err.name === "ValidationError") {
            const errors = Object.keys(err.errors).map(function(key) {
                if(err.errors[key].name === "CastError" && err.errors[key].path === "price") {
                    return "Price must be number";
                }
                return err.errors[key].message;
            });
            next(new ErrorHandler(400, "Bad Request", errors));
        }
        next(new ErrorHandler());
    }
});

router.delete("/:id", async function(req, res, next) {
    try {
        await Campgrounds.findByIdAndDelete(req.params.id);
        res.redirect("/campgrounds");
    } catch (err) {
        next(new ErrorHandler());
    }
});

router.get("/:id/edit", async function(req, res, next) {
    try {
        const campground = await Campgrounds.findById(req.params.id);
        res.render("edit", {title: "Edit Campground", active: "campgrounds", campground, user: req.session.user});
    } catch(err) {
        next(new ErrorHandler(404, "Not Found", `Can't find campground with id: ${req.params.id}`));
    }
});

router.post("/:id/review", async function(req, res, next) {
    try {
        const campground = await Campgrounds.findById(req.params.id);
        const review = await new Reviews({
            rating: req.body.rating,
            review: req.body.review,
            campgroundId: campground._id
        }).save();
        campground.reviewsId.push(review._id);
        await campground.save();
        await campground.updateOverAllRating();
        res.redirect(`/campgrounds/${req.params.id}`);
    } catch(err) {
        if(err.name === "ValidationError") {
            const errors = Object.keys(err.errors).map(function(key) {
                if(err.errors[key].name === "CastError" && err.errors[key].path === "rating") {
                    return "Rating must be number";
                }
                return err.errors[key].message;
            });
            next(new ErrorHandler(404, "Bad Request", errors));
        }
        next(new ErrorHandler());
    }
});

module.exports = router;