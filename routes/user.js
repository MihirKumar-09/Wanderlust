//!---------HERE WE DEFINE ALL USER ROUTES-------
const express = require("express");
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const router = express.Router({ mergeParams: true });
// Require controller for users ;
const userController = require("../controllers/user.js");

//!-----USE (router.route) -------
router
  .route("/signup")
  // SignUp form is render;
  .get(userController.renderSignUpForm)
  // Submit the SignUp form
  .post(wrapAsync(userController.signUp));

router
  .route("/login")
  // LogIn form is render;
  .get(userController.renderLoginForm)
  // Submit the login details
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.signIn
  );

//!-------LOG OUT THE USER--------;
router.get("/logout", userController.logOut);
// Export the user router;
module.exports = router;
