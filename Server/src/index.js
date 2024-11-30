import connectDB from "./DB/dBConnection.js";
import app from "./app.js";
import dotenv from "dotenv";

dotenv.config(()=>{
    path:"./env"
});

connectDB()
    .then(()=>{
        const port = process.env.PORT;
        app.listen(port, ()=>{
            console.log("Server is running on port : ", port);
        });
    })
    .catch(err=>{
        console.log("Something went wrong while connecting to database !\n ", err);
    });
