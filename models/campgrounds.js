const mongoose = require("./seeds.js");
const Users = require("./users.js");
const Reviews = require("./reviews.js");

const campgroundsSchema = mongoose.Schema({
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    name: {
        type: String,
        maxlength: [50, "Max name length is 50"],
        required: [true, "Name is required"]
    },
    location: {
        type: String,
        maxlength: [100, "Max location length is 100"],
        required: [true, "Location is required"]
    },
    price: {
        type: Number,
        min: [0, "Price cannot be minus"],
        required: [true, "Price is required"]
    },
    image: [String],
    description: {
        type: String,
        required: [true, "Description is required"]
    },
    reviewsId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "review"
    }],
    overAllRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
        required: true
    }
});

campgroundsSchema.post("findOneAndDelete", async function(campground) {
    if(campground.reviewsId.length) {
        await Reviews.deleteMany({_id: {$in : campground.reviewsId}});
    }
});

campgroundsSchema.methods.updateOverAllRating = async function() {
    await this.populate("reviewsId");
    let sum = 0;
    this.reviewsId.forEach(function(review) {
        sum += review.rating;
    });
    await Campgrounds.findByIdAndUpdate(this._id, {overAllRating: (sum / this.reviewsId.length).toFixed(2)});
};

const Campgrounds = mongoose.model("campground", campgroundsSchema);

module.exports = Campgrounds;