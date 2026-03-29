const WS_URL = `ws://${window.location.hostname}:3000`;
const ws = new WebSocket(WS_URL);

let mediaRecorder;
let mediaStream;
const statusEl = document.getElementById("status");

ws.addEventListener("open", () => {
    if (statusEl.textContent === "Idle" || statusEl.textContent.startsWith("Error")) {
        statusEl.textContent = "Connected — idle";
    }
});

ws.addEventListener("error", () => {
    statusEl.textContent = "Error: WebSocket failed — is the backend running?";
});

document.getElementById("startBtn").onclick = startStreaming;
document.getElementById("stopBtn").onclick = stopStreaming;

function sendWhenOpen(payload) {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(payload);
    } else {
        ws.addEventListener("open", () => ws.send(payload), { once: true });
    }
}

async function startStreaming() {
    if (mediaRecorder && mediaRecorder.state === "recording") {
        return;
    }

    try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
        statusEl.textContent = "Error: microphone access denied or unavailable.";
        console.error(err);
        return;
    }

    const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "";

    mediaRecorder = mimeType
        ? new MediaRecorder(mediaStream, { mimeType })
        : new MediaRecorder(mediaStream);

    sendWhenOpen(JSON.stringify({ type: "start" }));
    statusEl.textContent = "Streaming…";

    mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0 && ws.readyState === WebSocket.OPEN) {
            ws.send(event.data);
        }
    };

    mediaRecorder.onstop = () => {
        if (mediaStream) {
            mediaStream.getTracks().forEach((t) => t.stop());
            mediaStream = null;
        }
        sendWhenOpen(JSON.stringify({ type: "stop" }));
        statusEl.textContent = "Stopped — check backend/uploads/";
    };

    mediaRecorder.start(250);
}

function stopStreaming() {
    if (!mediaRecorder || mediaRecorder.state !== "recording") {
        return;
    }
    mediaRecorder.stop();
}
