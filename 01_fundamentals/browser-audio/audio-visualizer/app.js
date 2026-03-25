/**
 * Audio Visualizer Application
 * Provides real-time audio visualization with frequency bars and waveform
 */

// ==========================
// Application Constants
// ==========================
const AUDIO_CONFIG = {
  SAMPLE_RATE: 44100,
  FFT_SIZE: 512,
  SMOOTHING_TIME_CONSTANT: 0.8,
  MIN_DECIBELS: -90,
  MAX_DECIBELS: -10
};

const CANVAS_CONFIG = {
  BAR_WIDTH: 2,
  BAR_GAP: 1,
  WAVEFORM_LINE_WIDTH: 2,
  TRAIL_ALPHA: 0.2
};

// ==========================
// DOM Element References
// ==========================
const audioControls = {
  startButton: document.getElementById('btnStart'),
  stopButton: document.getElementById('btnStop'),
  canvas: document.getElementById('canvas')
};

// ==========================
// Application State
// ==========================
let audioContext = null;
let analyser = null;
let microphone = null;
let mediaStream = null;

let frequencyData = null;
let waveformData = null;

let animationId = null;
let canvasContext = null;

// ==========================
// Initialize Audio Context
// ==========================
async function initializeAudioContext() {
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();

    analyser.fftSize = AUDIO_CONFIG.FFT_SIZE;
    analyser.smoothingTimeConstant = AUDIO_CONFIG.SMOOTHING_TIME_CONSTANT;
    analyser.minDecibels = AUDIO_CONFIG.MIN_DECIBELS;
    analyser.maxDecibels = AUDIO_CONFIG.MAX_DECIBELS;

    const bufferLength = analyser.frequencyBinCount;

    frequencyData = new Uint8Array(bufferLength);
    waveformData = new Uint8Array(bufferLength);

  } catch (error) {
    console.error('Error initializing audio context:', error);
    throw new Error('Failed to initialize audio context');
  }
}

// ==========================
// Start Visualization
// ==========================
async function startVisualization() {
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false
      }
    });

    if (!audioContext) {
      await initializeAudioContext();
    }

    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    microphone = audioContext.createMediaStreamSource(mediaStream);
    microphone.connect(analyser);

    updateControlsState(true);
    visualize();

  } catch (error) {
    console.error('Error starting visualization:', error);
    alert('Error accessing microphone. Please check permissions.');
  }
}

// ==========================
// Stop Visualization
// ==========================
function stopVisualization() {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }

  if (microphone) {
    microphone.disconnect();
    microphone = null;
  }

  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop());
    mediaStream = null;
  }

  updateControlsState(false);
  clearCanvas();
}

// ==========================
// Update UI State
// ==========================
function updateControlsState(isRecording) {
  audioControls.startButton.disabled = isRecording;
  audioControls.stopButton.disabled = !isRecording;
}

// ==========================
// Main Visualization Loop
// ==========================
function visualize() {
  animationId = requestAnimationFrame(visualize);

  analyser.getByteFrequencyData(frequencyData);
  analyser.getByteTimeDomainData(waveformData);

  drawFrame();
}

// ==========================
// Draw Frame
// ==========================
function drawFrame() {
  resizeCanvas();

  // Trail effect (instead of full clear)
  canvasContext.fillStyle = `rgba(15, 20, 25, ${CANVAS_CONFIG.TRAIL_ALPHA})`;
  canvasContext.fillRect(0, 0, audioControls.canvas.width, audioControls.canvas.height);

  drawBars();
  drawWaveform();
}

// ==========================
// Draw Frequency Bars
// ==========================
function drawBars() {
  const canvas = audioControls.canvas;
  const width = canvas.width;
  const height = canvas.height;

  const barWidth = CANVAS_CONFIG.BAR_WIDTH;
  const barGap = CANVAS_CONFIG.BAR_GAP;
  const totalBarWidth = barWidth + barGap;

  const numBars = Math.floor(width / totalBarWidth);

  for (let i = 0; i < numBars && i < frequencyData.length; i++) {
    const value = frequencyData[i];
    const percent = value / 255;

    const barHeight = percent * height;

    const x = i * totalBarWidth;
    const y = height - barHeight;

    // 🎨 Dynamic color (frequency and intensity)
    const hue = (i / numBars) * 360;
    const lightness = 40 + percent * 40;

    canvasContext.fillStyle = `hsl(${hue}, 100%, ${lightness}%)`;

    canvasContext.fillRect(x, y, barWidth, barHeight);
  }
}

// ==========================
// Draw Waveform
// ==========================
function drawWaveform() {
  const canvas = audioControls.canvas;
  const width = canvas.width;
  const height = canvas.height;

  canvasContext.beginPath();

  for (let i = 0; i < waveformData.length; i++) {
    const value = waveformData[i];
    const percent = value / 255;

    const x = (i / waveformData.length) * width;

    // Centered waveform
    const y = (percent - 0.5) * height + height / 2;

    if (i === 0) {
      canvasContext.moveTo(x, y);
    } else {
      canvasContext.lineTo(x, y);
    }
  }

  // 🎨 Color based on average volume
  const avg =
      waveformData.reduce((sum, val) => sum + val, 0) / waveformData.length;

  const hue = (avg / 255) * 360;

  canvasContext.strokeStyle = `hsl(${hue}, 100%, 70%)`;
  canvasContext.lineWidth = CANVAS_CONFIG.WAVEFORM_LINE_WIDTH;

  canvasContext.stroke();
}

// ==========================
// Resize Canvas (important)
// ==========================
function resizeCanvas() {
  const canvas = audioControls.canvas;

  if (
      canvas.width !== canvas.offsetWidth ||
      canvas.height !== canvas.offsetHeight
  ) {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
}

// ==========================
// Clear Canvas
// ==========================
function clearCanvas() {
  canvasContext.clearRect(
      0,
      0,
      audioControls.canvas.width,
      audioControls.canvas.height
  );
}

// ==========================
// Event Listeners
// ==========================
function initializeEventListeners() {
  audioControls.startButton.addEventListener('click', startVisualization);
  audioControls.stopButton.addEventListener('click', stopVisualization);

  window.addEventListener('resize', resizeCanvas);
}

// ==========================
// Initialize Application
// ==========================
function initializeApplication() {
  if (!navigator.mediaDevices?.getUserMedia) {
    alert('Your browser does not support audio capture.');
    return;
  }

  if (!window.AudioContext && !window.webkitAudioContext) {
    alert('Your browser does not support Web Audio API.');
    return;
  }

  canvasContext = audioControls.canvas.getContext('2d');

  initializeEventListeners();
  updateControlsState(false);
}

// ==========================
// DOM Ready
// ==========================
document.addEventListener('DOMContentLoaded', initializeApplication);