//!-------ENV FILE SET-UP------
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
//! Express set-up;
const express = require("express");
const app = express();
const path = require("path");
//Handle HTTP request;
app.use(express.urlencoded({ extended: true }));
//Server static files;
app.use(express.static(path.join(__dirname, "public")));
//Set view engine;
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
//Method Override;
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
// Access review schema and models ;
const Review = require("./models/review.js");
//ejs-mate : which is a npm package and act as a ejs layout engine ;
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);
// Require our ExpressError handling class;
const ExpressError = require("./utils/ExpressError.js");
//!------REQUIRE THE LISTING ROUTER-------
const listingRouter = require("./routes/listings.js");
//!------REQUIRE THE REVIEWS ROUTER-------
const reviewRouter = require("./routes/reviews.js");
//!------REQUIRE THE USER ROUTER-------
const userRouter = require("./routes/user.js");
//!-------USE EXPRESS SESSION------
const session = require("express-session");
//!-------USE MONGO SESSION TO STORE USER INFO---------
const MongoStore = require("connect-mongo");
//!------REQUIRE FLASH----------
const flash = require("connect-flash");
//!------REQUIRE PASSPORT-------
const passport = require("passport");
//!-----REQUIRE PASSPORT LOCAL-STRATEGY-------
const LocalStrategy = require("passport-local");
//!-----REQUIRE USER MODEL TO USE USER AUTHENTICATION------
const User = require("./models/user.js");

//! DB_URL;
const dbUrl = process.env.ATLASDB_URL;
//! MongoDB set-up;
const mongoose = require("mongoose");
main()
  .then(() => {
    console.log("Connect DB");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(dbUrl);
}
//!------CREATE MONGO SESSTION OPTION -------
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});
//!------CREATE SESSION OPTIONS------
const sessionOption = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

//!-------DEFINE SESSION------
app.use(session(sessionOption));
//!--------DEFINE CONNECT-FLASH FOR MSG-------
app.use(flash());
//!--------INITIALIZE PASSPORT--------
app.use(passport.initialize());
//!-------BUILD THE PASSPORT SESSION--------
app.use(passport.session());
//!------USE THE LOCAL STRATEGY-------
passport.use(new LocalStrategy(User.authenticate()));
//!------SERIALIZE THE PASSPORT-------
passport.serializeUser(User.serializeUser());
//!------DE-SERIALIZE THE PASSPORT-------
passport.deserializeUser(User.deserializeUser());

//!------MIDDLEWARE FOR FLASH MSG-----------;
app.use((req, res, next) => {
  //for listings;
  res.locals.successMsg = req.flash("success");
  res.locals.editMsg = req.flash("edit");
  res.locals.deleteMsg = req.flash("delete");
  //for reviews;
  res.locals.newReview = req.flash("newReview");
  res.locals.deleteReview = req.flash("deleteReview");
  // For errors;
  res.locals.showError = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

//!------------ NOW USE THE LISTINGS ROUTES---------
app.use("/listings", listingRouter);
//!------------ NOW USE THE LISTINGS ROUTES---------
app.use("/listings/:id/reviews", reviewRouter);
//!------------ NOW USE THE USER ROUTES---------
app.use("/", userRouter);

//! Error Handling Middleware
//! If user send request on wrong route
app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});
//! Error handling middleware;
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  // res.status(statusCode).send(message);
  res.status(statusCode).render("listings/error.ejs", { err });
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
