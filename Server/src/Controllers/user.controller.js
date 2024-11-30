import { User } from "../Models/user.model.js";
import { generateOTP } from "./otp.controller.js";
import validator from "validator";

// Generate Access and Refresh Token
const generateAccessAndRefreshToken = async(userId) =>{
    try {
        const user = await User.findById(userId);

        const accessToken = user.generateAccessToken();
        const refreshToken= user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave : false});

        return {accessToken, refreshToken};
    }
    catch (err) {
        throw new Error("Something went wrong while generating the tokens!");
    }
}


// Controller for Registering the Users
const signup = async(req, res) =>{
    try {
        const { userName, name, email, mobile, password } = req.body;
        
        if([userName, name, email, mobile, password].some(field => field?.trim() === "")){
            throw new Error("All Fields are required");
        }

        const existedUser = await User.findOne({$or:[{email}, {userName}, {mobile}]});

        if(existedUser){
            throw new Error("User Present");
        }

        const user = await User.create({
            userName, name, email, mobile, password
        });

        if(!user){
            throw new Error("User not Created, something went wrong.");
        }

        const otpResponse = await generateOTP({body:{email}}, res, false);
        if(otpResponse){
            res.status(200).json({
                success:true,
                userId : user._id,
                name : user.userName,
                email: user.email,
                mobile:user.mobile,
                message:"OTP sent on email",
            });
        }else{
            throw new Error("Failed in Sending OTP's.");
        }
    }
    catch (err) {
        res.status(400).json({
            success:false,
            message:err.message,
        });
    }
}

//Controller for login using password
const signInUsingPassword = async(req, res) => {
    try {
        const {userIdentifier,  password } = req.body;

        if([userIdentifier, password].some(field=>field?.trim() === "")){
            throw new Error("All Fields are required!");
        }

        let findString;
        if(validator.isEmail(userIdentifier)){
            findString = "email";

        }
        else if(validator.isMobilePhone(userIdentifier, "any", {strictMode:true})){
            findString = "mobile";
        }
        else{
            findString = "userName";
        }
   
        const user = await User.findOne({[findString] : userIdentifier});
        if(!user){
            throw new Error("User not found!");
        }

   

        if(!user.emailVerified){
            throw new Error("You are not verified your email, please verify first.");
        }
        
        const isPasswordValid = await user.isPasswordCorrect(password);

        if(!isPasswordValid){
            throw new Error("You Entered Wrong password.");
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user?._id);

        const loggedUser = await User.findById(user?._id).select("-password -refreshToken");

        const secure = true;

        const options = {
            httpsOnly : true,
            secure : secure,
            sameSite : "Lax",
            maxAge : 3600000
        }

        return res.status(200)
                .cookie("accessToken", accessToken, options)
                .cookie("refreshToken", refreshToken, options)
                .json({
                    success:true,
                    user:loggedUser,
                    accessToken:accessToken, 
                    refreshToken:refreshToken,
                    message:"User Logged in Successfully"   
                });

    } catch (err) {
        res.status(500).json({
            success:false,
            message:err.message,
        });
    }
}

//Controller for Login using OTP
const signInUsingOTP = async(req, res) =>{
    try {
        const {email, otp} = req.body;

        const user = await User.findOne({email});

        if(!user){
            throw new Error("User not found!");
        }

        if(user.emailOTP !== otp){
            throw new Error("OTP not matched or Expired OTP!");
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user?._id);

        const loggedUser = await User.findById(user?._id).select("-password -refreshToken");

        const secure = true;

        const options = {
            httpsOnly : true,
            secure : secure,
            sameSite : "Lax",
            maxAge : 3600000
        }

        return res.status(200)
                .cookie("accessToken", accessToken, options)
                .cookie("refreshToken", refreshToken, options)
                .json({
                    success:true,
                    user:loggedUser,
                    accessToken:accessToken, 
                    refreshToken:refreshToken,
                    message:"User Logged in Successfully"
                });

    } catch (err) {
        res.status(500).json({
            success:false,
            message:err.message,
        });
    }
}

//Controller for log out
const signOut = async(req, res) =>{
    try {
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $set:{
                    refreshToken:undefined,
                }
            },
            {
                new:true,
            }
        )

        const options = {
            httpsOnly:true,
            secure : true
        }

        return res.status(200)
                .clearCookie("accessToken", options)
                .clearCookie("refreshToken", options)
                .json({
                    success:true,
                    message:"User Logged Out Successfully!"
                })

    } catch (err) {
        res.status(500).json({
            success:false,
            message:err.message,
        });
    }
}


const getUser = async(req, res) =>{
    try {
        return res.status(200).json({
            user : req.user
        })
    } catch (err) {
        
    }
}

const googleLogin = async(req, res) =>{
    const token = jwt.sign()
}

export {
    signup,
    signInUsingPassword,
    signInUsingOTP,
    signOut,
    googleLogin,
    getUser
}