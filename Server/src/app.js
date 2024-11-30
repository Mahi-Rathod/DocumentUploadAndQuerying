import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";
import passport from "./passportConfig.js"
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors({
  origin:process.env.CORS_ORIGIN,
  credentials: true,
  exposedHeaders: ['Content-Length', 'Authorization', 'Set-Cookie'],  
}));

app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());



//Import Routers here
import userRouter from "./Routes/user.routers.js";
import emailRouter from "./Routes/otpVerification.router.js";
import documentRouter from "./Routes/document.router.js";

app.use("/api/user", userRouter);
app.use("/api", emailRouter);
app.use("/api/documents", documentRouter);
export default app;
