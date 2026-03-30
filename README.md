# Audio Chatbot Project

A comprehensive learning repository for developing an **audio-enabled chatbot** using modern web technologies. This project explores the full spectrum of browser-based audio processing, from basic recording to advanced real-time communication.

## 🎯 Project Goals

This repository aims to explore and implement:

- **Audio Input/Output** - Browser-based audio capture and playback
- **Speech-to-Text (STT)** - Converting spoken words to text
- **Text-to-Speech (TTS)** - Converting text responses to speech
- **Real-time Communication** - Live audio chat interactions
- **AI Integration** - Connecting with chatbot APIs and language models

## 📁 Project Structure

```
audio-chatbot/
├── 01_fundamentals/           # Core audio processing examples
│   └── browser-audio/         # Browser API demonstrations
│       ├── simple-audio-recorder/  # Basic MediaRecorder usage
│       └── audio-visualizer/       # Real-time audio visualization
├── 02_speech_processing/      # STT/TTS implementations (planned)
├── 03_real_time/             # WebRTC and streaming (planned)
├── 04_ai_integration/        # Chatbot API connections (planned)
└── main_project/             # Final integrated chatbot (planned)
```

## 🚀 Getting Started

### Prerequisites

- **Modern Web Browser** with Web Audio API support
- **Local Development Server** (required for microphone access)
- **Basic Knowledge** of HTML, CSS, and JavaScript

### Quick Start

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd audio-chatbot
   ```

2. **Start a local server** (choose one method):

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

3. **Open your browser** and navigate to:
   - `http://localhost:8080/01_fundamentals/browser-audio/simple-audio-recorder/`
   - `http://localhost:8080/01_fundamentals/browser-audio/audio-visualizer/`

### Browser Permissions

The audio examples require microphone access. Your browser will prompt for permission when you first use the recording features.

## 🛠️ Technologies Used

- **Vanilla JavaScript (ES6+)** - Modern JavaScript features
- **Web Audio API** - Real-time audio processing
- **MediaRecorder API** - Audio recording capabilities
- **Canvas API** - Audio visualization
- **CSS Custom Properties** - Theming and responsive design
- **BEM Methodology** - CSS architecture
- **ARIA Attributes** - Accessibility compliance

## 📚 Learning Path

### Phase 1: Fundamentals (Current)
- ✅ Basic audio recording with MediaRecorder
- ✅ Real-time audio visualization
- ✅ Modern JavaScript patterns and best practices
- ✅ Accessibility and responsive design

### Phase 2: Speech Processing (Planned)
- Speech-to-text integration
- Text-to-speech implementation
- Audio preprocessing and enhancement
- Voice activity detection

### Phase 3: Real-time Communication (Planned)
- WebRTC for peer-to-peer audio
- Audio streaming protocols
- Low-latency audio processing
- Network optimization

### Phase 4: AI Integration (Planned)
- Chatbot API integration
- Natural language processing
- Context management
- Response generation

### Phase 5: Main Project (Planned)
- Complete audio chatbot implementation
- User interface design
- Performance optimization
- Production deployment

## 🎨 Code Standards

This project follows industry best practices:

- **Clean Code** - Readable, maintainable, and well-documented
- **Modern JavaScript** - ES6+ features, async/await, modules
- **Accessibility First** - WCAG compliance and screen reader support
- **Responsive Design** - Mobile-first approach
- **Error Handling** - Comprehensive error management
- **Performance** - Optimized for smooth real-time audio processing

## 🤝 Contributing

Contributions are welcome! Please:

1. Follow the established code standards
2. Include comprehensive documentation
3. Add proper error handling
4. Ensure accessibility compliance
5. Test across multiple browsers

## 📖 Documentation

- [Fundamentals Guide](01_fundamentals/README.md) - Detailed guide to audio basics
- [Simple Audio Recorder](01_fundamentals/browser-audio/simple-audio-recorder/README.md) - Recording implementation
- Individual project READMEs for specific implementations

## 🔧 Troubleshooting

### Common Issues

**Microphone not working:**
- Ensure you're using HTTPS or localhost
- Check browser permissions
- Verify microphone hardware

**Audio not playing:**
- Check browser autoplay policies
- Ensure audio context is resumed after user interaction
- Verify audio format support

**Performance issues:**
- Use Chrome DevTools to profile audio processing
- Check for memory leaks in audio contexts
- Optimize canvas rendering frequency

## 📄 License

This project is for educational purposes. Feel free to use and modify for learning.

## 🔮 Future Enhancements

- Integration with popular AI APIs (OpenAI, Google Cloud Speech)
- Advanced audio effects and processing
- Multi-language support
- Voice biometrics and speaker recognition
- Real-time collaboration features

---

**Status:** 🟢 Active Development | **Phase:** 1 - Fundamentals Complete
