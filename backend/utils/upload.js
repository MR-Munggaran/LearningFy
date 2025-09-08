import multer from "multer";
import path from "path";
import fs from "fs";

// Konfigurasi penyimpanan dengan folder otomatis
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "./utils/upload/others";

    // tentukan folder berdasarkan ekstensi
    const ext = path.extname(file.originalname).toLowerCase();
    if (/(jpeg|jpg|png|gif)/.test(ext)) {
      folder = "./utils/upload/images";
    } else if (/pdf/.test(ext)) {
      folder = "./utils/upload/docs";
    }

    // buat folder jika belum ada
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    cb(null, folder);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Filter hanya terima image + pdf
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error("Only images and PDF are allowed"));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB
});
