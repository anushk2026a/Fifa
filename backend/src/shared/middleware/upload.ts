import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "node:stream";
import type { Request } from "express";
import { env } from "../../config/env";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key:    env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

const ALLOWED_MIME: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png":  ".png",
  "image/webp": ".webp",
  "image/gif":  ".gif",
};

function fileFilter(
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) {
  if (ALLOWED_MIME[file.mimetype]) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (JPEG, PNG, WebP, GIF) are allowed"));
  }
}

const memoryStorage = multer.memoryStorage();
const upload = multer({ storage: memoryStorage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

/** Upload a buffer to Cloudinary and return the secure URL. */
export async function toCloudinary(buffer: Buffer, folder: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error || !result) return reject(error ?? new Error("Cloudinary upload failed"));
        resolve(result.secure_url);
      },
    );
    Readable.from(buffer).pipe(stream);
  });
}

export const experienceUpload = upload;
export const newsUpload        = upload;
