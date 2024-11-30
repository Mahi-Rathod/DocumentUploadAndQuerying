import {v2 as cloudinary} from "cloudinary";
import fs from 'fs';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure : true,
});

const uploadOnCloudinary = async (localFilePath) =>{
    try{
        if(!localFilePath) return null
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_typ : "auto",
        });
        console.log("File is upload on cloudinary", response.url);
        return response;
    }
    catch(error){
        console.log(error)
        fs.unlinkSync(localFilePath);
        return error;
    }
}

export { uploadOnCloudinary }