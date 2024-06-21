const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/YelpCamp")
    .then(function() {
        console.log("Database connected");
    })
    .catch(function(err) {
        console.log("Failed to connect to database");
        console.log(err);
    });

module.exports = mongoose;