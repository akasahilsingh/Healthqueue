import fs from "fs/promises";
import { v2 as cloudinary } from "cloudinary";

const connectCloudinary = async () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
  });
};

const cleanupTempFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    // The temp file may already be gone; cleanup is best-effort.
  }
};

const extractPublicIdFromCloudinaryUrl = (imageUrl) => {
  if (!imageUrl || imageUrl.startsWith("data:")) {
    return null;
  }

  const match = imageUrl.match(
    /\/image\/upload\/(?:v\d+\/)?(.+?)(?:\.\w+)?(?:\?.*)?$/i,
  );

  if (!match || !match[1]) {
    return null;
  }

  return match[1];
};

export const deleteCloudinaryAssetByUrl = async (imageUrl) => {
  if (!imageUrl || imageUrl.startsWith("data:")) {
    return false;
  }

  const publicId = extractPublicIdFromCloudinaryUrl(imageUrl);
  if (!publicId) {
    return false;
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result?.result === "ok" || result?.result === "not found";
  } catch (error) {
    return false;
  }
};

export const uploadTempFileToCloudinary = async (file, resourceType = "image") => {
  try {
    const upload = await cloudinary.uploader.upload(file.path, {
      resource_type: resourceType,
    });

    return upload.secure_url;
  } finally {
    if (file?.path) {
      await cleanupTempFile(file.path);
    }
  }
};

export default connectCloudinary;