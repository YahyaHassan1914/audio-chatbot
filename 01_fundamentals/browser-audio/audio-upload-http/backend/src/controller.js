exports.handleUpload = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    return res.status(200).json({
      message: "File uploaded successfully",
      file: {
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size,
        storedAs: `uploads/${req.file.filename}`,
      },
    });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};