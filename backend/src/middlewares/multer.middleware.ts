/*Handling mutipart-form-data */
import asyncHandler from "../utils/asyncHandler.js";
import multer, { type Options } from "multer";
import type { NextFunction, Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs"
const __dirname = fileURLToPath(import.meta.url)

const uploadsRoot = path.join(__dirname, "..", "..", "uploads");
// Ensure the uploads folder exists (Docker-friendly)
if (!fs.existsSync(uploadsRoot)) {
  fs.mkdirSync(uploadsRoot, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create a subfolder dynamically (e.g., csv or images)
    const type = file.mimetype.includes("csv") ? "csv" : "images";
    const folder = path.join(uploadsRoot, type);

    if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });

    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const options: Options = {
  limits: {
    fileSize: 5 * 1024 * 1024, //5MB
    files: 1, //max no of file fileds
  },
  storage: storage,
  //traverses the each and every uploaded file if many and evaluates the mimetype
  fileFilter: (req: Request, file: any, cb: any) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|avif|csv)$/)) {
      //reject file
      cb(
        new Error("File mimetype not supported, allowed [jpeg,jpg,png,avif,csv]"),
        false
      );
    }
    //accept file
    cb(null, true);
  },
};
const upload = multer(options);

//upload a single file
const uploadSingleFile = (name: string) => upload.single(name);
//upload multiple files with the same name
const uploadMultipleFiles = (name: string, numberOfFiles: number) =>
  upload.array(name, numberOfFiles);
//upload multiple files with different names,array of objects where the key is the name of  file ana value is array of files
const uploadMultipleFields = (fields: multer.Field[]) => upload.fields(fields);
//handle text-only
const uploadTextOnly = () => upload.none();
//accept all files
const uploadAnyFiles = () => upload.any();

asyncHandler(async (req: Request, res: Response, next: NextFunction) => upload);

export {
  uploadSingleFile,
  uploadMultipleFiles,
  uploadMultipleFields,
  uploadTextOnly,
  uploadAnyFiles,
  uploadsRoot
};
