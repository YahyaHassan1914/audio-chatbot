const multer = require("multer");
const fs = require("fs");
const path = require("path");

const uploadsDir = path.resolve(__dirname, "..", "uploads");

// storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      fs.mkdirSync(uploadsDir, { recursive: true });
      cb(null, uploadsDir);
    } catch (err) {
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    const safeExt = path.extname(file.originalname || "").slice(0, 10);
    cb(null, `${Date.now()}${safeExt}`);
  },
});

// file filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("audio/")) {
    cb(null, true);
  } else {
    cb(new Error("Only audio files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

module.exports = upload;