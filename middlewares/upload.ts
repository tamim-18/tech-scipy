import multer, { FileFilterCallback } from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { Request, Response, NextFunction } from "express";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/images/"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ".jpeg");
  },
});

const multerFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file format") as unknown as null, false); // Ensures type compatibility
  }
};

const uploadPhoto = multer({
  storage: storage,
  fileFilter: multerFilter,
  limits: { fileSize: 1000000 }, // Limit file size to 1MB
});

const productImgResize = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.files) return next();

  const files = req.files as Express.Multer.File[];
  await Promise.all(
    files.map(async (file) => {
      const outputPath = `public/images/products/${file.filename}`;
      await sharp(file.path)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(outputPath);
      fs.unlinkSync(file.path); // Delete original file
    })
  );
  next();
};

const blogImgResize = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.files) return next();

  const files = req.files as Express.Multer.File[];
  await Promise.all(
    files.map(async (file) => {
      const outputPath = `public/images/blogs/${file.filename}`;
      await sharp(file.path)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(outputPath);
      fs.unlinkSync(file.path); // Delete original file
    })
  );
  next();
};

export { uploadPhoto, productImgResize, blogImgResize };
