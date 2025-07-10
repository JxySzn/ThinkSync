// Utility for uploading images to Cloudinary from the client
export async function uploadToCloudinary(
  file: File,
  folder: string
): Promise<string> {
  // 1. Get signature from API
  const sigRes = await fetch("/api/cloudinary-signature", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder }),
  });
  const sigData = await sigRes.json();

  // 2. Prepare form data
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", sigData.apiKey);
  formData.append("timestamp", sigData.timestamp);
  formData.append("signature", sigData.signature);
  formData.append("folder", folder);

  // 3. Upload to Cloudinary
  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${sigData.cloudName}/auto/upload`,
    {
      method: "POST",
      body: formData,
    }
  );
  const uploadData = await uploadRes.json();
  if (!uploadData.secure_url) throw new Error("Cloudinary upload failed");
  return uploadData.secure_url;
}
