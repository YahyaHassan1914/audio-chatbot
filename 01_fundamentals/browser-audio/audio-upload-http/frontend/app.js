import { uploadAudio } from "./api.js";

const input = document.getElementById("audioFile");
const form = document.querySelector(".audio-upload-http__form");
const status = document.querySelector(".audio-upload-http__status");
const button = form.querySelector(".audio-upload-http__button");

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const file = input.files[0];

  // Validation
  if (!file) {
    status.textContent = "Please select a file";
    return;
  }

  if (!file.type.startsWith("audio/")) {
    status.textContent = "Only audio files are allowed";
    return;
  }

  if (file.size > MAX_FILE_SIZE) {
    status.textContent = "File too large (max 5MB)";
    return;
  }

  try {
    status.textContent = "Uploading...";
    button.disabled = true;

    const result = await uploadAudio(file);

    status.textContent = `Upload successful: ${result.file.filename}`;
    console.log(result);

    // Optional: reset file input
    input.value = "";

  } catch (err) {
    status.textContent = err.message || "Upload failed";
    console.error(err);
  } finally {
    button.disabled = false;
  }
});