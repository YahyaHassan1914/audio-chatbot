const BASE_URL = "http://localhost:3000";

export async function uploadAudio(file) {
  const formData = new FormData();
  formData.append("audio", file);

  try {
    const response = await fetch(`${BASE_URL}/api/upload`, {
      method: "POST",
      body: formData,
    });

    let data;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      throw new Error(data?.message || "Upload failed");
    }

    return data;
  } catch (error) {
    throw new Error(error.message || "Network error");
  }
}