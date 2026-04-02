import express from "express";
import { upload } from "./middleware.js";
import { transcribeController } from "./controller.js";

const router = express.Router();

router.post("/", upload.single("audio"), transcribeController);

export default router;