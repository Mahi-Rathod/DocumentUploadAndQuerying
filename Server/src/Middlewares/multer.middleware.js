import multer from "multer";

const storage = multer.diskStorage({
    destination : function(req, file, cb){
        cb(null, './Public/Temp');
    }
})

export const upload = multer({storage,});