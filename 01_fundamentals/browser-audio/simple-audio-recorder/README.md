# Simple browser recording sample

Minimal **HTML + CSS + JS** demo: microphone → `MediaRecorder` → `Blob` → `<audio>` playback via `URL.createObjectURL`.

## How to run it

Microphone access needs a [**secure context**](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts): **HTTPS** or **`http://localhost`**. Opening `index.html` as a `file://` URL often **blocks** `getUserMedia`, so use a small local server from the **repository root** (`audio-chatbot`).

**Python 3** (repo root):

```bash
python -m http.server 8080
```

Then open:

`http://localhost:8080/01_fundamentals/browser-audio/simple-audio-recorder/`

**Node** (if you have npm), from the repo root:

```bash
npx --yes serve .
```

Pick the URL it prints (usually `http://localhost:3000`) and append  
`/01_fundamentals/browser-audio/simple-audio-recorder/`.

In **VS Code / Cursor**, extensions like “Live Server” work the same way: serve the folder or project, then open the `simple-audio-recorder` path in the browser.

## Observations

- **Permissions**: The browser will prompt for microphone access; recording only starts after the user allows it.
- **Codec / container**: The current script uses `audio/webm` for the `MediaRecorder` and `Blob` type.
- **Stop behavior**: Pressing Stop ends recording and builds a playable audio blob. The script does not explicitly stop microphone tracks.
- **Object URLs**: The script creates a new `blob:` URL for each recording and assigns it to `<audio>`.
- **Playback**: The script calls `player.play()` after stop, and users can also use `<audio controls>` to play, pause, and seek.
