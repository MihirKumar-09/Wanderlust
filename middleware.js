// Require the listing and check the owner;
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

// Require the serverside scheam validation;
const { listingSchema, reviewSchema } = require("./schema.js");
// Require our ExpressError handling class;
const ExpressError = require("./utils/ExpressError.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // Save the redirect url if user not login ;
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in !");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

// Middleware for check listing owner
module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);

  if (!listing) {
    // ✅ handle invalid or missing id
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  if (!listing.owner.equals(res.locals.currentUser._id)) {
    // ✅ check the current user and listing owner
    req.flash("error", "You not the owner of this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

// ListingValidation Schema middleware for server;
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  }
  next();
};

// ReviewValidation Schema middleware for server;
module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  }
  next();
};

// Middlwere for check the review author
module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);

  if (!review.author.equals(res.locals.currentUser._id)) {
    // ✅ check the current user and listing owner
    req.flash("error", "You not the author of this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
