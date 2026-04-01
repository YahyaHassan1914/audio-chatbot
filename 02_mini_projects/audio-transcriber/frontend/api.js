const BASE_URL = "http://localhost:3000";

/**
 * Upload audio file to backend for transcription
 * @param {File} file
 * @returns {Promise<{ text: string }>}
 */
export async function transcribeAudio(file) {
  const formData = new FormData();
  formData.append("audio", file);

  try {
    const response = await fetch(`${BASE_URL}/transcribe`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to transcribe audio");
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error.message);
    throw error;
  }
}