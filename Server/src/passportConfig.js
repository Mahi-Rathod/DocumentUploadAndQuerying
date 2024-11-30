import passport from "passport";
import jwt from "jsonwebtoken";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "./Models/user.model.js";
import 'dotenv/config';
passport.use(
  new GoogleStrategy(
    {
      clientID: `${process.env.GOOGLE_CLIENT_ID}`,
      clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
            // If no user found by googleId, check if the email exists
            user = await User.findOne({ email: profile.emails[0].value });
  
            if (!user) {
              // If no user found by email, create a new user
              user = await User.create({
                googleId: profile.id,
                userName: profile.emails[0].value, // Use email as username
                email: profile.emails[0].value, // Store email
                name: profile.displayName, // Use display name
                emailVerified: true,
                password: profile.emails[0].value
              });
            } else {
              // User exists but didn't log in with Google, you might want to link the Google account
              user.googleId = profile.id; // Optional: Link Google ID to existing user
              await user.save(); // Save the user with updated Google ID
            }
          }

        // Generate JWT tokens
        const accessTokenJWT = jwt.sign(
          { userId: user._id },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "15m" }
        );
        const refreshTokenJWT = jwt.sign(
          { userId: user._id },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "7d" }
        );

        return done(null, {
          accessToken: accessTokenJWT,
          refreshToken: refreshTokenJWT,
        });
      } catch (err) {
        return done(err);
      }
    }
  )
);

export default passport