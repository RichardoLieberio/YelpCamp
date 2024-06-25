const mongoose = require("./seeds.js");
const Users = require("./users.js");
const Campgrounds = require("./campgrounds.js");

const reviewsSchema = mongoose.Schema({
    authorId: {
        type: String,
        ref: "user"
    },
    rating: {
        type: Number,
        min: [1, "Rating must between 1-5"],
        max: [5, "Rating must between 1-5"],
        required: [true, "Rating is required"]
    },
    review: {
        type: String,
        required: [true, "Review is required"]
    },
    campgroundId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "campground"
    }
});

const Reviews = mongoose.model("review", reviewsSchema);

module.exports = Reviews;