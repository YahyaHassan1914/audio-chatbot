import { transcribeAudio } from "./api.js";

// DOM elements
const form = document.getElementById("uploadForm");
const fileInput = document.getElementById("audio-file");
const statusEl = document.getElementById("status");
const submitBtn = form.querySelector("button");

// =========================
// Helpers
// =========================

function logStep(step, message, data = null) {
    if (data) {
        console.log(`🔹 [${step}] ${message}`, data);
    } else {
        console.log(`🔹 [${step}] ${message}`);
    }
}

function updateStatus(message, type = "default") {
    statusEl.textContent = message;

    statusEl.classList.remove(
        "transcriber__status--success",
        "transcriber__status--error"
    );

    if (type === "success") {
        statusEl.classList.add("transcriber__status--success");
    }

    if (type === "error") {
        statusEl.classList.add("transcriber__status--error");
    }
}

function validateFile(file) {
    logStep("VALIDATE", "Validating file");

    if (!file) {
        throw new Error("Please select a file.");
    }

    console.table({
        name: file.name,
        size_kb: (file.size / 1024).toFixed(2),
        type: file.type
    });

    const maxSizeBytes = 5 * 1024 * 1024;

    if (file.size > maxSizeBytes) {
        throw new Error("File must be smaller than 5 MB.");
    }

    if (!file.type.startsWith("audio/")) {
        throw new Error("Invalid file type. Please upload an audio file.");
    }

    logStep("VALIDATE", "File is valid ✅");
}

// =========================
// Event Handling
// =========================

form.addEventListener("submit", async (e) => {
    console.group("🚀 FORM SUBMISSION");

    logStep("EVENT", "Form submit triggered");

    e.preventDefault();
    logStep("EVENT", "Default prevented");

    const file = fileInput.files[0];

    logStep("INPUT", "File input element", fileInput);
    logStep("INPUT", "Files list", fileInput.files);
    logStep("INPUT", "Selected file", file);

    try {
        validateFile(file);

        updateStatus("Uploading and transcribing...");
        submitBtn.disabled = true;

        logStep("API", "Sending file to backend...");

        const result = await transcribeAudio(file);

        logStep("API", "Response received", result);

        updateStatus(`Transcription: ${result.text}`, "success");
    } catch (error) {
        console.error("❌ ERROR:", error);
        updateStatus(error.message, "error");
    } finally {
        submitBtn.disabled = false;
        logStep("EVENT", "Submit flow finished");

        console.groupEnd();
    }
});