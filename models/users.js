const bcrypt = require("bcrypt");
const mongoose = require("./seeds.js");
const Campgrounds = require("./campgrounds.js");
const Reviews = require("./reviews.js");

const usersSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: [30, "Maximum name length is 30"],
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        unique: [true, "Email has been registered"],
        required: [true, "Email is required"]
    },
    pwd: {
        type: String,
        required: [true, "Password is required"]
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        required: true
    },
    campgroundsId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "campground"
    }],
    reviewsId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "review"
    }]
});

usersSchema.statics.findEmail = async function(email) {
    const user = await this.findOne({email});
    return user ? true : false;
}

usersSchema.statics.findAndValidate = async function(email, pwd) {
    const user = await this.findOne({email});
    if(user && await bcrypt.compare(pwd, user.pwd)) {
        return user;
    } else {
        return false;
    }
}

usersSchema.pre("save", async function(next) {
    this.pwd = await bcrypt.hash(this.pwd, 12);
    next();
});

const Users = mongoose.model("user", usersSchema);

module.exports = Users;