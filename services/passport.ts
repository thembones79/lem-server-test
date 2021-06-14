import passport from "passport";
import { User } from "../models/user";
import { Strategy as JwtStrategy } from "passport-jwt";
import { ExtractJwt } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import { keys } from "../config/keys";

// Create local strategy
const localOptions = { usernameField: "email" };
const localLogin = new LocalStrategy(
  localOptions,
  function (email, password, done) {
    // Verify this username and password, call done with the user
    // if it is the correct username and password
    // otherwise, call done with false
    User.findOne({ email: email }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }

      // compare passwords - is "password" equal to user.password?

      user.comparePassword(password, function (err: Error, isMatch: boolean) {
        if (err) {
          done(err);
          return;
        }
        if (!isMatch) {
          done(null, false);
          return;
        }
        done(null, user);
        return;
      });
    });
  }
);

// Setup options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  secretOrKey: keys.secret,
};

// Create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, function (payload, done) {
  // See if the user ID in the payload exists in our database
  // if it does, call 'done' with that user, otherwise,
  // call done without a user object
  User.findById(payload.sub, function (err, user) {
    if (err) {
      return done(err, false);
    }
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
