const passport = require("passport");
const googleStrategy = require("passport-google-oauth").OAuth2Strategy;
const { createHmac } = require("crypto");
const User = require("../models/user");
const logger = require("../logger");
const env = require("./environment");
require("dotenv").config();

try {
  // Using Google Authentication
  passport.use(
    new googleStrategy(
      {
        clientID: env.googleauth.client_id,
        clientSecret: env.googleauth.client_secret,
        callbackURL: env.googleauth.call_back_url,
      },
      function (accessToken, refreshToken, profile, done) {
        User.findOne({ email: profile.emails[0].value }).exec(function (
          err,
          user
        ) {
          if (err) {
            logger.error(`Error in Google Auth : ${err}`);
            return done(err, false);
          }

          // User exits
          if (user) {
            return done(null, user);
          }

          // If no user, create user
          else {
            const hash = createHmac(
              "sha256",
              (Math.random() + 1).toString(36).substring(7)
            )
              .update("I love cupcakes")
              .digest(process.env.GOOGLE_HEX); //Hash for Password
            const hash2 = createHmac(
              "sha256",
              (Math.random() + 1).toString(36).substring(7)
            ).digest(process.env.GOOGLE_HEX); //Hash for ResetPass
            User.create(
              {
                name: profile.displayName,
                email: profile.emails[0].value,
                password: hash,
                resetpass: hash2,
              },
              function (err, user) {
                if (err) {
                  logger.error(
                    `Error in Creating User for Google Auth : ${err}`
                  );
                  return;
                }

                return done(null, user);
              }
            );
          }
        });
      }
    )
  );

  module.exports = passport;
} catch (err) {
  logger.error(
    `Error using Google Auth at passport-google-oauth2-strategy.js : ${err}`
  );
}
