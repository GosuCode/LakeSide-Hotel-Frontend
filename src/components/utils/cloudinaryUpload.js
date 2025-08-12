export const uploadImageToCloudinary = async (file) => {
  try {
    // Debug: Log configuration
    const cloudName =
      import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "your_cloud_name";
    const uploadPreset =
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "your_upload_preset";

    console.log("Cloudinary Config:", { cloudName, uploadPreset });

    // Check if configuration is set
    if (
      cloudName === "your_cloud_name" ||
      uploadPreset === "your_upload_preset"
    ) {
      throw new Error(
        "Cloudinary configuration not set. Please check your .env file."
      );
    }

    // Validate file
    if (!file) {
      throw new Error("No file provided");
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error("File size too large. Maximum size is 10MB");
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      throw new Error("Invalid file type. Please select an image file");
    }

    // Create form data for upload
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("cloud_name", cloudName);

    // Upload to Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Cloudinary upload failed:", errorData);

      if (response.status === 400) {
        throw new Error(
          "Invalid upload preset or cloud name. Please check your configuration."
        );
      } else if (response.status === 401) {
        throw new Error(
          "Upload preset is not configured correctly. Please check your Cloudinary settings."
        );
      } else if (response.status === 413) {
        throw new Error("File size too large for Cloudinary.");
      } else {
        throw new Error(
          `Upload failed with status ${response.status}. Please try again.`
        );
      }
    }

    const data = await response.json();

    if (!data.secure_url) {
      throw new Error("Upload successful but no URL returned from Cloudinary");
    }

    return data.secure_url;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);

    if (error.message.includes("Failed to fetch")) {
      throw new Error(
        "Network error. Please check your internet connection and try again."
      );
    }

    throw error;
  }
};
