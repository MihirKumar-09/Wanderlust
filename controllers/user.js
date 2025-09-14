const User = require("../models/user.js");
//!---RENDER SIGN-UP FORM-----
module.exports.renderSignUpForm = (req, res) => {
  res.render("users/signup.ejs");
};

//!----SIGN-UP-----
module.exports.signUp = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);

    // middleware for auto login after sign up;
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Wanderlust !");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

//!-----RENDER SIGN-IN FORM-----
module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

//!-----LOG-IN------
module.exports.signIn = async (req, res) => {
  req.flash("success", "Welcome back! to Wanderlust");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

//!-------LOG-OUT----
module.exports.logOut = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "LogOut Successfully !");
    res.redirect("/listings");
  });
};
