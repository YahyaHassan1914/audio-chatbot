const express = require("express");
const cors = require("cors");
const path = require("path");
const uploadRoute = require("./routes");

const app = express();

app.use(
  cors({
    origin: true,
  })
);

app.get("/health", (req, res) => {
  res.status(200).json({ ok: true });
});

app.use("/api", uploadRoute);

app.use("/uploads", express.static(path.resolve(__dirname, "..", "uploads")));

// Basic error handler (incl. Multer errors)
app.use((err, req, res, next) => {
  if (!err) return next();

  const message = err.message || "Server error";
  const isMulterLimit = typeof message === "string" && message.toLowerCase().includes("file too large");

  return res.status(isMulterLimit ? 413 : 400).json({ message });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});