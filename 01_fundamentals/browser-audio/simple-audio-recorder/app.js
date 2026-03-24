/**
 * Simple Audio Recorder Application
 * Records audio from microphone and provides playback functionality
 */

// Application constants
const RECORDER_CONFIG = {
  MIME_TYPE: 'audio/webm',
  FALLBACK_MIME_TYPE: 'audio/ogg',
  TIMESLICE: 250, // Smaller timeslice = smoother chunks
  AUDIO_CONSTRAINTS: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true
  }
};

const UI_MESSAGES = {
  IDLE: 'Idle — press Start.',
  RECORDING: 'Recording…',
  STOPPING: 'Stopping recording…',
  STOPPED: 'Recording stopped — playback ready.',
  ERROR_MICROPHONE: 'Error: unable to access microphone.',
  ERROR_UNSUPPORTED: 'Error: MediaRecorder not supported in this browser.'
};

// DOM element references
const audioRecorderElements = {
  startButton: document.getElementById("btnStart"),
  stopButton: document.getElementById("btnStop"),
  statusDisplay: document.getElementById("status"),
  audioPlayer: document.getElementById("player")
};

// Application state
let mediaRecorder = null;
let audioChunks = [];
let currentMediaStream = null;

/**
 * Gets or creates a persistent microphone stream
 * This prevents audio degradation between recordings
 * @returns {Promise<MediaStream>}
 */
async function getOrCreateStream() {
  if (currentMediaStream) return currentMediaStream;

  currentMediaStream = await navigator.mediaDevices.getUserMedia({
    audio: RECORDER_CONFIG.AUDIO_CONSTRAINTS
  });

  return currentMediaStream;
}

/**
 * Starts audio recording from the microphone
 * @returns {Promise<void>}
 */
async function startRecording() {
  try {
    // Clean up previous recorder (but NOT the stream)
    cleanupMediaRecorder();
    await delay(50);

    // Check MediaRecorder support
    if (!window.MediaRecorder) {
      throw new Error('MediaRecorder not supported');
    }

    // Get persistent stream
    const stream = await getOrCreateStream();

    // Determine supported MIME type
    const mimeType = MediaRecorder.isTypeSupported(RECORDER_CONFIG.MIME_TYPE)
        ? RECORDER_CONFIG.MIME_TYPE
        : RECORDER_CONFIG.FALLBACK_MIME_TYPE;

    // Create MediaRecorder
    mediaRecorder = new MediaRecorder(stream, { mimeType });

    // Reset chunks
    audioChunks = [];

    // Setup events
    setupMediaRecorderEvents(mimeType);

    // Start recording
    if (mediaRecorder.state === 'inactive') {
      mediaRecorder.start(RECORDER_CONFIG.TIMESLICE);

      audioRecorderElements.statusDisplay.textContent = UI_MESSAGES.RECORDING;
      updateUIForRecording(true);

    } else {
      throw new Error(`MediaRecorder is in unexpected state: ${mediaRecorder.state}`);
    }

  } catch (error) {
    console.error("Error starting recording:", error);
    handleRecordingError(error);
  }
}

/**
 * Stops the current audio recording
 */
function stopRecording() {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    audioRecorderElements.statusDisplay.textContent = UI_MESSAGES.STOPPING;
    mediaRecorder.stop();
    updateUIForRecording(false);
  } else if (mediaRecorder) {
    console.warn(`Cannot stop recording - MediaRecorder state: ${mediaRecorder.state}`);
  }
}

/**
 * Sets up MediaRecorder event handlers
 * @param {string} mimeType
 */
function setupMediaRecorderEvents(mimeType) {
  // Collect ALL chunks (no discarding)
  mediaRecorder.ondataavailable = (event) => {
    if (event.data && event.data.size > 0) {
      audioChunks.push(event.data);
      console.log(`Collected chunk: ${event.data.size} bytes (total: ${audioChunks.length})`);
    }
  };

  // Finalize recording
  mediaRecorder.onstop = () => {
    handleRecordingComplete(mimeType);
  };

  // Handle errors
  mediaRecorder.onerror = (event) => {
    console.error('MediaRecorder error:', event.error);
    handleRecordingError(event.error);
  };
}

/**
 * Handles recording completion
 * @param {string} mimeType
 */
function handleRecordingComplete(mimeType) {
  try {
    const audioBlob = new Blob(audioChunks, { type: mimeType });
    const audioUrl = URL.createObjectURL(audioBlob);

    audioRecorderElements.audioPlayer.src = audioUrl;
    audioRecorderElements.audioPlayer.load();

    audioRecorderElements.audioPlayer.play().catch(err => {
      console.warn('Auto-play failed:', err);
    });

    audioRecorderElements.statusDisplay.textContent = UI_MESSAGES.STOPPED;

    // Cleanup recorder only (NOT stream)
    setTimeout(() => {
      cleanupMediaRecorder();
    }, 100);

  } catch (error) {
    console.error('Error processing recording:', error);
    handleRecordingError(error);
  }
}

/**
 * Updates UI state
 * @param {boolean} isRecording
 */
function updateUIForRecording(isRecording) {
  audioRecorderElements.startButton.disabled = isRecording;
  audioRecorderElements.stopButton.disabled = !isRecording;
}

/**
 * Handles errors
 * @param {Error} error
 */
function handleRecordingError(error) {
  let errorMessage = UI_MESSAGES.ERROR_MICROPHONE;

  if (error.name === 'NotAllowedError') {
    errorMessage = 'Error: Microphone access denied.';
  } else if (error.name === 'NotFoundError') {
    errorMessage = 'Error: No microphone found.';
  } else if (error.message.includes('MediaRecorder not supported')) {
    errorMessage = UI_MESSAGES.ERROR_UNSUPPORTED;
  }

  audioRecorderElements.statusDisplay.textContent = errorMessage;
  updateUIForRecording(false);

  cleanupAllResources();
}

/**
 * Cleans up MediaRecorder only
 */
function cleanupMediaRecorder() {
  if (mediaRecorder) {
    mediaRecorder.ondataavailable = null;
    mediaRecorder.onstop = null;
    mediaRecorder.onerror = null;
    mediaRecorder = null;
  }
}

/**
 * Cleans up ALL resources (used only on fatal errors or unload)
 */
function cleanupAllResources() {
  cleanupMediaRecorder();

  if (currentMediaStream) {
    currentMediaStream.getTracks().forEach(track => track.stop());
    currentMediaStream = null;
  }
}

/**
 * Utility delay
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Initialize application
 */
function initializeApplication() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    audioRecorderElements.statusDisplay.textContent =
        'Error: Your browser does not support audio recording.';
    return;
  }

  updateUIForRecording(false);
  audioRecorderElements.statusDisplay.textContent = UI_MESSAGES.IDLE;

  audioRecorderElements.startButton.addEventListener("click", startRecording);
  audioRecorderElements.stopButton.addEventListener("click", stopRecording);

  // Cleanup on-page unload
  window.addEventListener("beforeunload", cleanupAllResources);
}

// Start app
document.addEventListener('DOMContentLoaded', initializeApplication);