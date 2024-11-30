import {Schema, model} from "mongoose";

const DocumentSchema = new Schema({
    fileName:{
        type : String,
        required : true
    },
    fileType:{
        type : String,
        required : true,
    },
    fileSize : {
        type : Number,
        required : true,
    },
    key : {
        type : String,
        required : true
    },
    userId : {
        type : Schema.Types.ObjectId,
        ref : "User"
    }
}, {timestamps : true});

export const Document = model("Document", DocumentSchema);