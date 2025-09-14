//! Used to define schema and Models
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const User = require("./user.js");
const { required } = require("joi");

//Creeate a schema;
const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    url: { type: String, required: true },
    filename: { type: String, required: true },
  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  category: {
    type: String,
    enum: [
      "trending",
      "tiny rooms",
      "amazing views",
      "iconic cities",
      "mountains",
      "beach",
      "snow",
      "amazing pools",
      "desert",
      "forest",
      "city",
      "village",
      "luxury",
      "castles",
      "omg",
    ],
    required: true,
  },
});
//! -----LISTING DELETE MIDDLEWARE---- IT BASICALLY DELETE ALL REVIEWS AFTER LISTING IS DELETE
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
