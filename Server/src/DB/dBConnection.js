import mongoose from "mongoose";
import { DB_Name } from "../constants.js"

const connectDB = async() =>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}${DB_Name}`);
        console.log("Database Connection Istablished Successfully.");
    } catch (err) {
        console.log("MongoDB Connection Error: ", err);
    }
}

export default connectDB;