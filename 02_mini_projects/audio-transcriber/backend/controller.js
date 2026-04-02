import { transcribeAudio } from "./service.js";

export async function transcribeController(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No audio file uploaded" });
        }

        const text = await transcribeAudio(req.file);

        res.json({ text });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Transcription failed" });
    }
}