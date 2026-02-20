//! ------- ENV FILE SET-UP -------
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const ejsMate = require("ejs-mate");

//! ------- MODELS -------
const User = require("./models/user.js");

//! ------- ROUTERS -------
const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");

//! ------- UTILS -------
const ExpressError = require("./utils/ExpressError.js");

//! ------- DATABASE CONNECTION -------
const dbUrl = process.env.ATLASDB_URL;

async function main() {
  try {
    await mongoose.connect(dbUrl);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Database connection failed:", err);
  }
}
main();

//! ------- EXPRESS SETUP -------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

//! ------- SESSION STORE -------
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", function (err) {
  console.log("Session Store Error", err);
});

//! ------- SESSION CONFIG -------
const sessionOption = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOption));
app.use(flash());

//! ------- PASSPORT SETUP -------
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//! ------- GLOBAL LOCALS MIDDLEWARE -------
app.use((req, res, next) => {
  res.locals.successMsg = req.flash("success");
  res.locals.editMsg = req.flash("edit");
  res.locals.deleteMsg = req.flash("delete");
  res.locals.newReview = req.flash("newReview");
  res.locals.deleteReview = req.flash("deleteReview");
  res.locals.showError = req.flash("error");

  // Prevent production crash
  res.locals.currentUser = req.user || null;

  next();
});

//! ------- ROUTES -------
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

//! ------- 404 HANDLER -------
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});

//! ------- ERROR HANDLER -------
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  res.status(statusCode).render("listings/error.ejs", { err });
});

//! ------- SERVER START -------
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
