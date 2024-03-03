import { v2 as cloudinary } from "cloudinary";

import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const cloudinaryServer = async (localpath) => {
  try {
    if (localpath) {
      const respons = await cloudinary.uploader.upload(localpath, {
        resource_type: "auto",
      });
      return respons;
    }
    return null;
  } catch (error) {
    fs.unlinkSync(localpath);
    console.log("CLOUDINARY FILE UPLOAD ERROR : ", error);
  }
};
export default cloudinaryServer;
