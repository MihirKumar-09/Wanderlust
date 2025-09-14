//!---------HERE WE DEFINE ALL LISTINGS ROUTES-------
const express = require("express");
const router = express.Router({ mergeParams: true });
// Require our custome error handling class;
const wrapAsync = require("../utils/wrapAsync.js");
// Require loggedIn middleware !
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
// Require controller ;
const listingController = require("../controllers/listings.js");
//!-----USE MULTER FOR UPLOAD FILES--------
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const Listing = require("../models/listing.js");
const upload = multer({ storage });

//!------USE (router.route) --------

router
  .route("/")
  .get(wrapAsync(listingController.indexROute)) // GET route where all listing is show
  // POST new listing after form is filled
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.postNewListing)
  );

//! Create Route/New route;
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  // SHOW route ;
  .get(wrapAsync(listingController.showRoute))
  // UPDATE route;
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateRoute)
  )
  // DELETE route;
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteRoute));

//!Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editRoute)
);

//!--------NOW EXPORTS THE LISTINGS.JS INTO AP.JS--------
module.exports = router;
