import { Document } from "../Models/document.model.js";
import { uploadOnCloudinary } from "../utils/uploadOnCloudinary.js";
import { getObjectUrl, putObjectUrl } from "../utils/uploadOnS3.js";

// import { uploadFileOnS3 } from "../utils/uploadOnS3.js";

// const uploadDocuments = async(req, res) =>{
//   try {
//     const user = req.user;

//     const docLocalPath = req.files?.document[0]?.path

//     if(!docLocalPath){
//       throw new Error("Product Image is Required ....");
//     }

//     const doc = await uploadOnCloudinary(docLocalPath);

//     if(!doc){
//       throw new Error("Something went wrong..");
//     }

//     const document = await Document.create({
//       url : doc.url,
//       user : user
//     })

//     if(!document){
//       throw new Error("Something went wrong.");
//     }

//     return res.status(201)
//               .json({
//                 success: true,
//                 message : "file uploaded Successfully",
//                 file : document,
//               })

//   } catch (error) {
//     res.status(500).json({
//       success : false,
//       message : error.message
//     });
//   }
// }

// const getDocuments = async(req, res) =>{
//   try {
//     const docs = await Document.find({});

//     if(!docs){
//       throw new Error("Can not get documents");
//     }

//     return res.status(200).json({
//       documents : docs
//     })
//   } catch (error) {
//     res.status(500).json({
//       success : false,
//       message : error.message
//     })
//   }
// }

// const getDocument = async(req, res) =>{
//   try {
//     const { id } = req.params;

//     const doc = await Document.findById({id});

//     if(!doc){
//       throw new Error("Can not get Documents");
//     }
//   } catch (err) {
//     res.status(500).json({
//       success : false,
//       message : err.message
//     })
//   }
// }

// export {
//   uploadDocuments,
//   getDocuments,
//   getDocument
// }

const uploadDocuments = async (req, res) => {
  try {
    const { fileName, fileType, fileSize } = req.body;
    const { _id } = req.user;
    const key = `users/${_id}/${fileName}`;
    const s3Url = await putObjectUrl(key, fileType);

    if (!s3Url) {
      throw new Error("Error generating presigned URL");
    }

    const newFile = await Document.create({
      fileName,
      fileType,
      fileSize,
      key: key,
      userId: _id,
    });

    if (!newFile) {
      throw new Error("Something went wrong while saving data.");
    }

    return res.status(200).json({
      url: s3Url,
      key : key,
      id  : newFile._id.toString(),
      userId : _id
    });
  } catch (err) {
    return res.status(500).json({
      success: true,
      message: err.message,
    });
  }
};

const getDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const document = await Document.findById({ _id: id });

    if (!document) {
      throw new Error("Not able to fetch document.");
    }

    const url = await getObjectUrl(document.key);

    if (!url) {
      throw new Error("Not able to generate presigned url");
    }

    return res.status(200).json({
      url: url,
    });
  } catch (err) {
    return res.status(500).json({
      success: true,
      message: err.message,
    });
  }
};

const getAllDocuments = async (req, res) => {
  try {
    const { _id } = req.user;
    const files = await Document.find({ userId: _id }).sort();

    if (!files) {
      throw new Error("Unable to fetch files.");
    }

    const allDocuments = await Promise.all(
      files.map(async (file)=>{
        try {
          const url = await getObjectUrl(file.key);

          return {
            fileName : file.fileName,
            fileType : file.fileType,
            url
          }
        } catch (err) {
          throw new Error("Failed to Fetch URl for file : ", file.fileName);
        }
      })
    )
    return res.status(200).json(allDocuments);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export { uploadDocuments, getAllDocuments, getDocument };
