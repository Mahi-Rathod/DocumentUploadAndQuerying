import { Router } from "express";
import { generateOTP, verifyOTP } from "../Controllers/otp.controller.js";

const router = Router();

router.post("/send-email-otp", generateOTP);
router.post("/verify-email-otp", verifyOTP);

export default router;