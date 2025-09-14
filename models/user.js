// Require Express;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Require passport-local-mangoose;
const passportLocalMongoose = require("passport-local-mongoose");

// Define a user schema ; Here username and password field create automatically by passport-local-mongoose
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
});

//! Passport-local-mongoose plugin (it is important !)
userSchema.plugin(passportLocalMongoose);

// Create user model;
const User = mongoose.model("User", userSchema);

// Export the user model;
module.exports = User;
