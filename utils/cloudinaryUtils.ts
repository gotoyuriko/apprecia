export async function uploadToCloudinary(file: File): Promise<string> {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
        throw new Error("Cloudinary config missing — check NEXT_PUBLIC_CLOUDINARY_* env vars");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: formData }
    );

    if (!response.ok) {
        throw new Error(`Cloudinary upload failed: ${await response.text()}`);
    }

    const data = await response.json();

    // A 2xx can still come back without secure_url (eager/async transforms,
    // moderation hooks). Casting it through would put undefined into the
    // Firestore image arrays, which fails far from here with an opaque error.
    if (typeof data?.secure_url !== "string") {
        throw new Error(
            `Cloudinary upload returned no secure_url: ${JSON.stringify(data)}`
        );
    }

    return data.secure_url;
}
