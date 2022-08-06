const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const logger = require("../logger");

// Authentication using Passport
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passReqToCallback: true,
    },
    (req, email, password, done) => {
      // Find User and Establish the identity
      User.findOne({ email: email }, (err, user) => {
        if (err) {
          req.flash("error", err);
          logger.error(`Error finding User in Authentication : ${err}`);
          return done(err);
        }

        // User doesn't match or wrong password
        if (!user || user.password != password) {
          req.flash("error", "Invalid Username/Password");
          logger.info(`User does not exist or password incorrect!`);
          return done(null, false);
        }
        // Correct Password and user exists
        return done(null, user);
      });
    }
  )
);

// Serializing the user to decide which key is to be kept in the cookies
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserializing the user from the key in the cookies
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    if (err) {
      logger.error(`Error in finding user by ID : ${err}`);
      return done(err);
    }

    if (user) {
      return done(null, user);
    } else {
      logger.info(`User not found at passport-local-strategy.js`);
      return done(null);
    }
  });
});

// Check if user is authenticated
passport.checkAuthentication = function (req, res, next) {
  // User signed in
  if (req.isAuthenticated()) {
    return next();
  }
  // User not signed in
  return res.redirect("/users/signin");
};

// Pass User with every request
passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    // Req.user contains the current signed in user from session cookie. Sending to the locals for views.
    res.locals.user = req.user;
  }
  next();
};

// Used to Make sure user doesn't access signin and signup pages when logged in
passport.alreadyAuthenticated = function (req, res, next) {
  // User isnt signed in
  if (!req.isAuthenticated()) {
    return next();
  }
  // User already signed in
  return res.redirect("/users/profile");
};

module.exports = passport;
