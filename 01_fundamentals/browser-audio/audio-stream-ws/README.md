# Audio stream over WebSocket

A small demo that captures microphone audio in the browser, streams **binary chunks** to a Node.js server over WebSocket, and **writes a `.webm` file** when recording stops.

## Overview

- **Frontend**: `MediaRecorder` emits `audio/webm` chunks every 250ms and sends them over WS; control messages `{"type":"start"}` and `{"type":"stop"}` bracket a session.
- **Backend**: Buffers binary chunks per connection while recording; on `stop`, concatenates them and saves under `backend/uploads/recording-<timestamp>.webm`.

## Features

- Real-time chunk streaming to the server
- **Server-side save** on stop (WebM container, same format as `MediaRecorder`)
- Static hosting of the frontend from the same server (`http://localhost:3000`)

## Project structure

- `frontend/`: HTML, CSS, JS (`app.js`)
- `backend/`: Express + `ws` server, recordings output in `backend/uploads/` (gitignored)

## Getting started

### Prerequisites

- Node.js
- A microphone; use **HTTPS** or **`http://localhost`** so `getUserMedia` is allowed

### Run

From `01_fundamentals/browser-audio/audio-stream-ws/backend`:

```bash
npm install
npm start
```

Open **http://localhost:3000**.

1. Click **Start** — streaming begins; the server clears its buffer and records incoming binary chunks.
2. Click **Stop** — `MediaRecorder` flushes the last chunk, then the client sends `stop`; the server writes `backend/uploads/recording-<timestamp>.webm` if any data was buffered.

## Troubleshooting

- **No file after Stop**: Ensure the backend log shows chunks (try speaking during recording). Very short sessions might yield empty buffers depending on timing.
- **Connection errors**: Confirm the backend is running and port `3000` is free.

## Code standards

- Control messages as JSON; audio as binary **Blob** from the browser
