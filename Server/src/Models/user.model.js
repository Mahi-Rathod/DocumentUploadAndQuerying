import { model, Schema } from "mongoose";
import bcrypt, { hash } from "bcrypt";
import jwt from "jsonwebtoken";

const UserSchema = new Schema({
    userName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    mobile: {
      type: String,
      unique:true,
      maxlength: 13,
      sparse: true
    },
    password: {
      type: String,
      required: true,
    },
    emailVerified: {
      type: Boolean,
    },
    mobileVerified: {
      type: Boolean,
    },
    emailOTP: {
      type: String,
      maxlength: 6,
    },
    otpExpires : {
      type: Date,
    },
    mobileOTP: {
      type: String,
      maxlength: 6,
    },
    googleId:{
      type:String,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

//Saving Password in hash form
UserSchema.pre('save', async function(next){
    if(!this.isModified("password")){
        return next();
    }

    this.password = await hash(this.password, 10);
    next();
});

//Checking for correct password || compare password
UserSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password);
}

//Generating Access Token
UserSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id : this._id,
            email: this.email,
            mobile: this.mobile,
            userName: this.userName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
}

//Generate Refresh Token
UserSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY,
        }
    )
}

export const User = model("User", UserSchema);
