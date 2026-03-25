# Audio Visualizer

A minimal yet comprehensive implementation demonstrating real-time audio visualization using the Web Audio API. This
project showcases the complete pipeline from microphone input to dynamic visual rendering on a canvas.

## Overview

This project demonstrates the fundamental concepts of real-time audio analysis and visualization in the browser by
capturing audio from the user's microphone, processing it through an `AnalyserNode`, and rendering both frequency and
waveform data onto an HTML `<canvas>`. It serves as an excellent starting point for understanding audio visualization
and canvas-based rendering in web applications.

## Features

* **Live Microphone Input**: Real-time audio capture using `getUserMedia()`
* **Frequency Bar Visualization**: Displays audio spectrum (bass → treble)
* **Waveform Rendering**: Visualizes raw audio signal in real-time
* **Dynamic Color System**: Colors react to frequency and volume
* **Smooth Animation Loop**: Uses `requestAnimationFrame` for efficient rendering
* **Trail Effect**: Subtle motion blur for smoother visuals
* **Error Handling**: Graceful handling of permission and API errors
* **Accessibility**: ARIA roles and semantic HTML structure

## Technologies Used

* **Web Audio API**: Audio processing and analysis (`AudioContext`, `AnalyserNode`)
* **getUserMedia()**: Microphone access and stream handling
* **Canvas API**: Real-time rendering of visualizations
* **Typed Arrays (`Uint8Array`)**: Efficient audio data handling
* **requestAnimationFrame**: High-performance animation loop
* **CSS Custom Properties**: Theming and layout consistency
* **ARIA Attributes**: Accessibility compliance

## How It Works

### Audio Visualization Pipeline

1. **Permission Request**: Browser prompts for microphone access via `getUserMedia()`
2. **Audio Context Creation**: Initializes `AudioContext` for audio processing
3. **Stream Source Setup**: Converts microphone stream into an audio node
4. **AnalyserNode Configuration**: Configures FFT size and smoothing
5. **Data Extraction**:

    * Frequency data (`getByteFrequencyData`)
    * Time-domain data (`getByteTimeDomainData`)
6. **Rendering Loop**:

    * Runs via `requestAnimationFrame`
    * Updates data arrays each frame
7. **Canvas Drawing**:

    * Bars represent frequency spectrum
    * Line represents waveform
8. **Visual Effects**:

    * Dynamic colors based on sound
    * Trail effect for smoother motion

### Key Configurations

```javascript
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
```

## Getting Started

### Prerequisites

* Modern web browser with Web Audio API support
* Microphone access (browser will prompt for permission)
* Local development server (required for microphone access)

### Running the Application

Microphone access requires a [**secure context
**](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts): **HTTPS** or **`http://localhost`**. Opening
`index.html` as a `file://` URL will **block** `getUserMedia`.

1. **Start a local server** from the project root:

   **Python 3:**

   ```bash
   python -m http.server 8080
   ```

   **Node.js:**

   ```bash
   npx serve .
   ```

   **VS Code Live Server:**

    * Install the Live Server extension
    * Right-click project folder → "Open with Live Server"

2. **Open your browser** and navigate to:

   ```
   http://localhost:8080/
   ```

3. **Grant microphone permission** when prompted

4. **Click "Start"** to begin visualization

5. **Click "Stop"** to end visualization

## Code Architecture

### Main Functions

* `initializeApplication()`: Initializes app state, context, and event listeners
* `initializeAudioContext()`: Sets up `AudioContext` and `AnalyserNode`
* `startVisualization()`: Requests microphone access and starts rendering loop
* `stopVisualization()`: Stops animation and cleans up resources
* `visualize()`: Main loop for updating audio data and rendering frames
* `drawFrame()`: Coordinates drawing of bars and waveform
* `drawBars()`: Renders frequency spectrum as vertical bars
* `drawWaveform()`: Renders time-domain waveform
* `resizeCanvas()`: Ensures canvas resolution matches display size
* `clearCanvas()`: Clears rendering surface
* `updateControlsState(isRecording)`: Updates UI button states

### Error Handling

The application includes robust error handling for:

* Microphone access denial (`NotAllowedError`)
* Missing microphone (`NotFoundError`)
* Unsupported Web Audio API
* Audio processing failures

### Resource Management

* MediaStream is properly stopped on visualization end
* Audio nodes are disconnected when not in use
* Animation loop is cancelled via `cancelAnimationFrame`
* Canvas is cleared on stop
* Memory-efficient typed arrays reused across frames

## Browser Compatibility

* **Chrome/Edge**: Full support
* **Firefox**: Full support
* **Safari**: Full support (modern versions)
* **Mobile browsers**: Supported with microphone permissions

## Technical Details

### Audio Processing

* **FFT Analysis**: Uses Fast Fourier Transform for frequency data
* **Frequency Resolution**: Controlled via `fftSize`
* **Smoothing**: Reduces jitter using `smoothingTimeConstant`
* **Data Format**: `Uint8Array` values (0–255)

### Visualization Behavior

* **Bars**:

    * Represent frequency intensity
    * Lower indices = bass, higher = treble
* **Waveform**:

    * Represents raw signal oscillation
    * Centered vertically on canvas
* **Color Mapping**:

    * Hue based on frequency or volume
    * Lightness based on amplitude
* **Trail Effect**:

    * Semi-transparent redraw instead of full clear
    * Creates motion blur effect

## Customization

### Visualization Settings

```javascript
const CANVAS_CONFIG = {
    BAR_WIDTH: 4,
    BAR_GAP: 2,
    WAVEFORM_LINE_WIDTH: 3,
    TRAIL_ALPHA: 0.1
};
```

### Audio Sensitivity

```javascript
analyser.fftSize = 1024; // higher detail
analyser.smoothingTimeConstant = 0.9; // smoother animation
```

### UI Theming

```css
:root {
    --color-primary: #your-brand-color;
    --color-bg: #your-background;
    --color-text: #your-text;
}
```

## Troubleshooting

### Common Issues

**Visualization not starting:**

* Ensure microphone permission is granted
* Use HTTPS or localhost
* Check browser compatibility

**No movement in visualizer:**

* Microphone input may be too quiet
* Check system input levels

**Blurry canvas:**

* Ensure canvas resolution matches display size (`resizeCanvas()`)

**Performance issues:**

* Reduce `fftSize`
* Lower canvas resolution
* Reduce bar count

## Learning Objectives

This project demonstrates:

1. **Web Audio API fundamentals**: Real-time audio analysis
2. **Canvas rendering**: Pixel-based drawing and animation
3. **Animation loops**: Efficient frame rendering
4. **Signal visualization**: Frequency vs waveform understanding
5. **Performance optimization**: Efficient data handling
6. **Accessibility**: Semantic and ARIA-compliant UI design

## Next Steps

Build upon this example to create:

* Circular / radial visualizers
* Beat and bass detection
* Particle systems reacting to audio
* Audio-reactive UI components
* Advanced audio effects and filters

## Contributing

When contributing to this project:

1. Follow the established code standards
2. Maintain comprehensive JSDoc documentation
3. Include proper error handling
4. Test across multiple browsers
5. Ensure accessibility compliance
