# Simple Audio Recorder

A minimal yet comprehensive implementation demonstrating browser-based audio recording using the MediaRecorder API. This
project showcases the complete audio capture pipeline from microphone input to playback.

## Overview

This project demonstrates the fundamental concepts of browser audio recording by capturing audio from the user's
microphone, processing it through the MediaRecorder API, and providing immediate playback functionality. It serves as an
excellent starting point for understanding audio processing in web applications.

## Features

- **Simple Recording Interface**: Clean start/stop recording controls
- **Real-time Status Updates**: Live feedback on recording state
- **Automatic Playback**: Immediate audio playback after recording stops
- **Error Handling**: Comprehensive error management and user feedback
- **Accessibility**: Full ARIA support and keyboard navigation

## Technologies Used

- **MediaRecorder API**: Core audio recording functionality
- **getUserMedia()**: Microphone access and stream management
- **Blob API**: Audio data storage and manipulation
- **URL.createObjectURL()**: Audio playback URL generation
- **Web Audio API**: Audio stream processing
- **CSS Custom Properties**: Theming and responsive design
- **ARIA Attributes**: Accessibility compliance

## How It Works

### Audio Recording Pipeline

1. **Permission Request**: Browser prompts for microphone access via `getUserMedia()`
2. **Stream Creation**: Persistent MediaStream created for repeated recordings
3. **MediaRecorder Setup**: Initializes MediaRecorder with MIME type (`audio/webm` or fallback `audio/ogg`) and
   chunking (`TIMESLICE: 250ms`)
4. **Data Collection**: Captures audio chunks in real-time
5. **Recording Completion**: Combines chunks into a `Blob`
6. **Playback**: Generates URL and sets `<audio>` element to play
7. **Resource Cleanup**: Stops media tracks and disposes of MediaRecorder instances

### Key Configurations

```javascript
const RECORDER_CONFIG = {
    MIME_TYPE: 'audio/webm',
    FALLBACK_MIME_TYPE: 'audio/ogg',
    TIMESLICE: 250,
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
```

## Getting Started

### Prerequisites

- Modern web browser with MediaRecorder API support
- Microphone access (browser will prompt for permission)
- Local development server (required for microphone access)

### Running the Application

Microphone access requires a [**secure context
**](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts): **HTTPS** or **`http://localhost`**. Opening
`index.html` as a `file://` URL will **block** `getUserMedia`.

1. **Start a local server** from the repository root (`audio-chatbot`):

   **Python 3:**
   ```bash
   python -m http.server 8080
   ```

   **Node.js:**
   ```bash
   npx serve .
   ```

   **VS Code Live Server:**
    - Install the Live Server extension
    - Right-click on the project folder → "Open with Live Server"

2. **Open your browser** and navigate to:
   ```
   http://localhost:8080/01_fundamentals/browser-audio/simple-audio-recorder/
   ```

3. **Grant microphone permission** when prompted

4. **Click "Start recording"** to begin audio capture

5. **Click "Stop"** to end recording and start playback

## Code Architecture

### Main Functions

- `initializeApplication()`: Sets up buttons, status, and event listeners
- `startRecording()`: Initializes MediaRecorder and starts capturing audio
- `stopRecording()`: Stops recording and triggers blob creation
- `setupMediaRecorderEvents()`: Handles ondataavailable, onstop, onerror
- `handleRecordingComplete()`: Combines chunks into blob and plays audio
- `updateUIForRecording(isRecording)`: Enables/disables buttons
- `handleRecordingError(error)`: Updates status messages and cleans up resources
- `cleanupMediaRecorder()`: Cleans up event handlers
- `cleanupAllResources()`: Stops tracks and cleans MediaRecorder

### Error Handling

The application includes robust error handling for:

- Microphone access denial (`NotAllowedError`)
- Missing microphone (`NotFoundError`)
- Unsupported MediaRecorder API
- Recording or processing errors

### Resource Management

- Persistent stream prevents audio degradation
- MediaRecorder instances cleaned up after each recording
- Blob URLs are re-created per recording
- Tracks and event listeners disposed properly

## Browser Compatibility

- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: Full support (iOS 14.3+)
- **Mobile browsers**: Supported with touch interactions

## Technical Details

### Audio Formats

- **Primary**: `audio/webm` (modern browsers)
- **Fallback**: `audio/ogg` (broader compatibility)
- **Automatic detection**: Uses `MediaRecorder.isTypeSupported()` to choose the supported MIME type
- **Chunking**: Uses `TIMESLICE` (250ms by default) to collect audio in smaller chunks for smoother recording

### Recording Behavior

- **Permissions**: Browser prompts for microphone access; recording only starts after user grants access
- **Persistent Stream**: Reuses a single MediaStream across multiple recordings to prevent audio degradation
- **Codec Selection**: Chooses the best supported codec based on browser support
- **Stop Behavior**: Combines all collected chunks into a single `Blob` and enables immediate playback
- **Stream Management**: Properly stops media tracks only on fatal errors or page unload; MediaRecorder instances
  cleaned up after each recording
- **Object URLs**: Generates new blob URL for each recording session and assigns it to the `<audio>` element
- **Error Handling**: Updates UI with descriptive messages on microphone access denial, missing devices, or unsupported
  MediaRecorder API

## Customization

### Audio Quality Settings

Modify the audio constraints for different quality levels:

```javascript
const audioConstraints = {
    echoCancellation: false,  // Disable for music recording
    noiseSuppression: false,  // Disable for natural audio
    autoGainControl: false,   // Disable for consistent levels
    sampleRate: 44100,        // CD quality
    channelCount: 2           // Stereo recording
};
```

### UI Customization

The interface uses CSS custom properties for easy theming:

```css
:root {
    --accent: #your-brand-color;
    --surface: #your-background-color;
    --text: #your-text-color;
}
```

## Troubleshooting

### Common Issues

**Recording not starting:**

- Check microphone permissions in browser settings
- Ensure you're using HTTPS or localhost
- Verify microphone is working in other applications

**No audio playback:**

- Check browser autoplay policies
- Ensure audio element has proper controls
- Verify audio format support

**Poor audio quality:**

- Adjust audio constraints for better quality
- Check microphone hardware and positioning
- Consider noise suppression settings

## Learning Objectives

This project demonstrates:

1. **MediaRecorder API mastery**: Complete recording workflow
2. **Stream management**: Proper resource handling
3. **Error handling**: Comprehensive user experience
4. **Modern JavaScript**: ES6+ features and best practices
5. **Accessibility**: WCAG-compliant interface design
6. **Responsive design**: Mobile-first approach

## Next Steps

Build upon this example to create:

- Multi-track audio recording
- Real-time audio effects
- Audio file export functionality
- Voice activity detection
- Advanced audio processing pipelines

## Contributing

When contributing to this project:

1. Follow the established code standards
2. Maintain comprehensive JSDoc documentation
3. Include proper error handling
4. Test across multiple browsers
5. Ensure accessibility compliance
