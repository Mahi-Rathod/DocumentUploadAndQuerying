import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCESS_KEY,
  },
});

const putObjectUrl = async (key, fileType) => {
  try {
    const params = {
      Bucket: "parse-docs-upload",
      Key: key,
      ContentType: fileType,
    };

    const command = new PutObjectCommand(params);

    const url = await getSignedUrl(s3, command);

    return url;
  } catch (err) {
    return err;
  }
};

const getObjectUrl = async (key) => {
  const params = {
    Bucket: "parse-docs-upload",
    Key: key,
  };
  const command = new GetObjectCommand(params);

  const url = await getSignedUrl(s3, command);

  return url;
};



export { putObjectUrl, getObjectUrl};
