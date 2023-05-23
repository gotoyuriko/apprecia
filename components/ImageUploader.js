import { useState } from "react";

const ImageUploader = () => {
    const [selectedImages, setSelectedImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);

    const handleDrop = (e) => {
        e.preventDefault();

        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    };

    const handleFiles = (files) => {
        const selected = files.filter((file) => file.type.startsWith("image/"));
        const selectedPaths = selected.map((file) => URL.createObjectURL(file));

        setSelectedImages((prevImages) => [...prevImages, ...selected]);
        setPreviewImages((prevImages) => [...prevImages, ...selectedPaths]);
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        handleFiles(files);
    };

    const handleRemove = (index) => {
        const updatedSelectedImages = selectedImages.filter((_, i) => i !== index);
        const updatedPreviewImages = previewImages.filter((_, i) => i !== index);

        setSelectedImages(updatedSelectedImages);
        setPreviewImages(updatedPreviewImages);
    };

    return (
        <div className="shadow-inner h-1/2 w-full bg-white flex flex-col items-center justify-center">
            <input
                type="file"
                id="upload"
                className="hidden"
                multiple
                onChange={handleFileSelect}
            />
            <label
                htmlFor="upload"
                className="bg-blue-500 text-white py-2 px-4 rounded-lg cursor-pointer"
            >
                Select Images
            </label>
            <div
                className="mt-4 text-gray-500"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
            >
                Drag and drop files here
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4">
                {previewImages.map((path, index) => (
                    <div key={index} className="relative h-32 w-32">
                        <div className="bg-white w-full h-full border border-gray-300 overflow-hidden">
                            <img src={path} alt="Preview" className="w-full h-auto" />
                        </div>
                        <button
                            className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 rounded-full"
                            onClick={() => handleRemove(index)}
                        >
                            X
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImageUploader;
