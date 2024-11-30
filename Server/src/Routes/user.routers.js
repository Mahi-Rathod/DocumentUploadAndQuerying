import { Router } from "express";
import passport from "../passportConfig.js";
import { signup, signInUsingPassword, signInUsingOTP, signOut, getUser } from "../Controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.post("/sign-up", signup);
router.post("/sign-in-using-password", signInUsingPassword);
router.post("/sign-In-using-otp", signInUsingOTP);
router.post("/sign-out",verifyJWT, signOut);
router.get("/get-user",verifyJWT, getUser);
// Route to initiate Google login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google callback route - returns access and refresh tokens as JSON
router.get('/google/callback', 
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const { accessToken, refreshToken } = req.user; // tokens created in passportConfig.js
    res.json({ accessToken, refreshToken });
  }
);

export default router;