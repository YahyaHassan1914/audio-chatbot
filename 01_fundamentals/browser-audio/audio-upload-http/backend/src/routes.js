const express = require("express");
const router = express.Router();
const upload = require("./middleware");
const { handleUpload } = require("./controller");

router.post("/upload", upload.single("audio"), handleUpload);

module.exports = router;