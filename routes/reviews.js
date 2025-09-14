//!---------HERE WE DEFINE ALL REVIEWS ROUTES-------
const express = require("express");
const router = express.Router({ mergeParams: true });
// Require our custome error handling class;
const wrapAsync = require("../utils/wrapAsync.js");
//Access Review schema and models;
const Review = require("../models/review.js");
//Access Listing schema and models;
const Listing = require("../models/listing.js");
// Require the validate review middleware
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");

// Require controller Review for formating ;
const reviewController = require("../controllers/review.js");
//!------REVIEWS ROUTE------
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

//!------DELETE REVIEW ROUTE-------
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.deleteReview)
);

//!--------NOW EXPORTS THE REVIEWS.JS INTO AP.JS--------
module.exports = router;
