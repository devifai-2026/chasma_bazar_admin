
const uploadToCloudinary = async (file, uploadOptions = {}) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "unsigned_preset");
  
  // Add optional parameters from uploadOptions
  if (uploadOptions.folder) {
    formData.append("folder", uploadOptions.folder);
  }
  if (uploadOptions.public_id) {
    formData.append("public_id", uploadOptions.public_id);
  }

  const response = await fetch(
    "https://api.cloudinary.com/v1_1/dvkalqadm/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error?.message || 'Upload failed');
  }

  return data;
};

export default uploadToCloudinary;