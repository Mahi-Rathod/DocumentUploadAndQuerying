import { User } from "../Models/user.model.js";
import emailTemplate from "../utils/otpEmailTemplate.js";
import sendEmail from "../utils/sendEmail.js";
//Send OTP Functions

const generateOTP = async(req, res, respond = true) =>{
    try {
        const { email } = req.body;
        const user = await User.findOne({email});

        if(!user){
            throw new Error("User not found.");
        }

        const otp = Math.floor(100000 + Math.random()*900000).toString();
        
        user.emailOTP = otp;
        user.otpExpires= Date.now() + 10 * 60 * 1000;
        const emailTemplateHTML = emailTemplate(user.name, otp);

        const emailSent = await sendEmail(emailTemplateHTML, email);
        if(!emailSent){
            throw new Error("Enter valid email.");
        }

        await user.save();

        if(respond){
            res.status(200).json({
                success : true,
                message : "Email sent Successfully!"
            });
        }

        return true;
    } catch (err) {
        if(respond){
            res.status(500).json({
                success:false,
                message:err.message,
            });
        }

        return false;
    }
}

const verifyOTP = async(req, res) =>{
    try {
        const {email, otp} = req.body;

        const user = await User.findOne({email});

        if(!user){
            throw new Error("User not found!");
        }

        if(user.emailOTP !== otp || Date.now() > user.otpExpires){
            throw new Error("OTP Expired!!");
        }

        user.emailVerified = true;
        user.emailOTP = null;
        user.otpExpires = null;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Email Verified!"
        });

    } catch (err) {
        res.status(500).json({
            success:false,
            message:err.message,
        });
    }
}

export {
    generateOTP,
    verifyOTP
}

