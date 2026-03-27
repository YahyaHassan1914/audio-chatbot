# Audio Upload over HTTP

A minimal end-to-end example showing how to upload an audio file from the browser to a Node/Express backend using `fetch()` + `FormData`.

## Overview

This example is useful when you want a simple “upload a recorded blob/file” workflow (not real-time streaming).

## Features

- **Browser file picker** with basic validation (`accept="audio/*"` + MIME checks)
- **HTTP upload** using `fetch()` and `FormData`
- **Express + Multer** backend with:
  - audio-only filtering
  - 5MB max upload size
  - automatic `uploads/` directory creation
  - JSON responses + basic error handling

## Project Structure

- `frontend/`: static HTML/CSS/JS UI
- `backend/`: Express server + upload route

## Getting Started

### Prerequisites

- Node.js installed
- A local static server (any) for the frontend (or VS Code Live Server)

### 1) Start the backend

From `01_fundamentals/browser-audio/audio-upload-http/backend`:

```bash
npm install
npm run dev
```

Backend runs at `http://localhost:3000`.

Health check:

```bash
curl http://localhost:3000/health
```

### 2) Run the frontend

Serve the repository root with any static server, then open:

`/01_fundamentals/browser-audio/audio-upload-http/frontend/`

Example (from repository root):

```bash
python -m http.server 8080
```

Then open:

`http://localhost:8080/01_fundamentals/browser-audio/audio-upload-http/frontend/`

## API

### `POST /api/upload`

- **Form field**: `audio`
- **Response**: JSON with stored filename and metadata

Example response:

```json
{
  "message": "File uploaded successfully",
  "file": {
    "filename": "1711560000000.webm",
    "mimetype": "audio/webm",
    "size": 123456,
    "storedAs": "uploads/1711560000000.webm"
  }
}
```

Uploaded files are also served at:

`GET /uploads/<filename>`

## Code Standards

- **Separation of concerns**: routes, controller, and upload middleware are split
- **Naming conventions**: camelCase for JS identifiers, consistent file names
- **Error handling**: user-friendly JSON messages for common upload failures
- **Security basics**: file-type filtering + size limit + no `node_modules/` in git

## Troubleshooting

- **413 / “File too large”**: reduce file size (limit is 5MB in `backend/src/middleware.js`)
- **CORS issues**: backend enables CORS; ensure you’re using the correct backend URL
- **No file uploaded**: verify the form field name is `audio`

