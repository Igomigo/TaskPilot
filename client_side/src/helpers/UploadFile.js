// Handles file uploads to the cloudinary server for storage

const url = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_NAME}/auto/upload`;

const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "TaskPilot");

    const response = await fetch(url, {
        method: "post",
        body: formData
    });

    const data = await response.json();

    return data;
}

export default uploadFile;