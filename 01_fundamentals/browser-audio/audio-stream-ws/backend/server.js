const express = require("express");
const WebSocket = require("ws");
const path = require("path");
const fs = require("fs").promises;

const RECORDINGS_DIR = path.join(__dirname, "uploads");

const app = express();
app.use(express.static(path.join(__dirname, "..", "frontend")));

const server = app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
    console.log(`Recordings directory: ${RECORDINGS_DIR}`);
});

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
    console.log("Client connected");

    let chunkBuffers = [];
    let recording = false;

    ws.on("message", async (data, isBinary) => {
        if (!isBinary) {
            const text = typeof data === "string" ? data : data.toString("utf8");
            try {
                const msg = JSON.parse(text);
                if (msg.type === "start") {
                    chunkBuffers = [];
                    recording = true;
                    console.log("Recording started (buffer cleared)");
                } else if (msg.type === "stop") {
                    recording = false;
                    if (chunkBuffers.length > 0) {
                        try {
                            const filepath = await saveRecording(chunkBuffers);
                            console.log(`Saved recording: ${filepath}`);
                        } catch (err) {
                            console.error("Failed to save recording:", err);
                        }
                    } else {
                        console.log("Stop received — no buffered audio to save");
                    }
                    chunkBuffers = [];
                }
            } catch {
                // ignore non-JSON control text
            }
            return;
        }

        if (recording) {
            chunkBuffers.push(Buffer.from(data));
        }
    });

    ws.on("close", () => {
        console.log("Client disconnected");
        chunkBuffers = [];
        recording = false;
    });
});

async function saveRecording(buffers) {
    await fs.mkdir(RECORDINGS_DIR, { recursive: true });
    const filename = `recording-${Date.now()}.webm`;
    const filepath = path.join(RECORDINGS_DIR, filename);
    await fs.writeFile(filepath, Buffer.concat(buffers));
    return filepath;
}
