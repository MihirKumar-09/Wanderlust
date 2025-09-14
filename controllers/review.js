// Requrire listing schema and review schema;
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

//!-----CREATE NEW REVIEW-----
module.exports.createReview = async (req, res) => {
  // pass the perticullar id , mean in which listing you do rating;
  let { id } = req.params;
  let listing = await Listing.findById(id);
  // create new review ;
  let { review } = req.body;
  let newReview = new Review(review);

  // Store the author name in review;
  newReview.author = req.user._id;
  // Push the new review into review object array;
  listing.reviews.unshift(newReview);

  // Now save the newReview;
  await newReview.save();
  // Now save the listing document because we modify the old listing document mean add a new review
  await listing.save();
  req.flash("newReview", "New review added !");
  res.redirect(`/listings/${id}`);
};

//!------DELETE REVIEW-------
module.exports.deleteReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("deleteReview", "Review delete successfully !");
  res.redirect(`/listings/${id}`);
};
