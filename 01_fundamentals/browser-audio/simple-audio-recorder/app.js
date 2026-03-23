// Grab references to DOM elements
const btnStart = document.getElementById("btnStart");
const btnStop = document.getElementById("btnStop");
const status = document.getElementById("status");
const player = document.getElementById("player");

let mediaRecorder; // Will hold the MediaRecorder instance
let audioChunks = []; // Array to store audio data chunks

// Function to start recording
async function startRecording() {
  try {
    // Request access to the microphone
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    // Create MediaRecorder with the stream
    // Use 'audio/webm' for modern browsers or 'audio/ogg' as fallback
    mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

    // Clear previous recordings
    audioChunks = [];

    // Event: when a chunk of audio is available, store it
    mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };

    // Event: when recording stops
    mediaRecorder.onstop = () => {
      // Combine all chunks into a single Blob
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });

      // Create a URL for the Blob
      const audioUrl = URL.createObjectURL(audioBlob);

      // Set the audio player source to the URL
      player.src = audioUrl;

      // Allow the player to load and play
      player.load();
      player.play();

      status.textContent = "Recording stopped — playback ready.";
    };

    // Start recording
    mediaRecorder.start();
    status.textContent = "Recording…";

    // Update buttons
    btnStart.disabled = true;
    btnStop.disabled = false;

  } catch (err) {
    console.error("Error accessing microphone:", err);
    status.textContent = "Error: unable to access microphone.";
  }
}

// Function to stop recording
function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
    btnStart.disabled = false;
    btnStop.disabled = true;
    status.textContent = "Stopping recording…";
  }
}

// Event listeners for buttons
btnStart.addEventListener("click", startRecording);
btnStop.addEventListener("click", stopRecording);
