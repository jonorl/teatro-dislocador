import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { Request, Response, NextFunction } from "express"; // Added for error handler wrapper

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOAD_DIR = path.join(__dirname, "../../uploads");

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, unique + path.extname(file.originalname));
  },
});

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten imágenes JPEG, PNG, WEBP y GIF."));
  }
};

// Base configurations
const uploadConfig = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB cap
});

// 1. Export the specific array parser matching your frontend key name: files.forEach((f) => fd.append("images", f))
const multerArray = uploadConfig.array("images", 12); 

// 2. Wrap it to intercept Multer errors and return clean JSON instead of crashing into HTML
export const uploadMultiple = (req: Request, res: Response, next: NextFunction) => {
  multerArray(req, res, (err: any) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ error: "El archivo es demasiado grande. Máximo 10MB." });
      }
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};