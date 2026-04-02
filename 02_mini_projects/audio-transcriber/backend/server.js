import express from "express";
import cors from "cors";
import transcribeRoutes from "./route.js";
import { config } from "./config.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/transcribe", transcribeRoutes);

app.listen(config.port, () => {
    console.log(`Server running on http://localhost:${config.port}`);
});