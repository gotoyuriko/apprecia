import Image from "next/image";
import { useState } from "react";

const ImageUploader = () => {
    // Create two state variables using the useState hook:
    // - selectedImages: An array that will store our uploaded images
    // - previewImages: An array that will store preview URLs for each image 
    const [selectedImages, setSelectedImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);

    // Define a function called handleDrop which takes in an event object (e)
    const handleDrop = (e) => {
        e.preventDefault();

        // Get the list of files that were dropped into the drop zone and convert it into an array
        const files = Array.from(e.dataTransfer.files);

        // Call the handleFiles function with the list of uploaded files
        handleFiles(files);
    };


    // Define a function called handleFiles which takes in an array of uploaded files (files)
    const handleFiles = (files) => {
        // Filter out any non-image files from the list of files using the filter method
        const selected = files.filter((file) => file.type.startsWith("image/"));

        // Create a new array of preview URLs for each image using the map method and URL.createObjectURL
        const selectedPaths = selected.map((file) => URL.createObjectURL(file));

        // Update the state variable selectedImages by appending the new list of selected images
        setSelectedImages((prevImages) => [...prevImages, ...selected]);

        // Update the state variable previewImages by appending the new list of preview URLs
        setPreviewImages((prevImages) => [...prevImages, ...selectedPaths]);
    };


    // This function is called when the user selects files using an <input type="file"> element
    const handleFileSelect = (e) => {
        // We convert the FileList object into a regular array so we can easily work with it
        const files = Array.from(e.target.files);
        // Call the 'handleFiles' function and pass in the array of selected files as an argument
        handleFiles(files);
    };

    // This function removes a selected image from the list of currently selected images and preview images
    const handleRemove = (index) => {
        // Create a new array by filtering out the selected image at the specified index
        const updatedSelectedImages = selectedImages.filter((_, i) => i !== index);
        // Create a new array by filtering out the preview image at the specified index
        const updatedPreviewImages = previewImages.filter((_, i) => i !== index);

        // Update the state variable for selected images with the newly filtered array
        setSelectedImages(updatedSelectedImages);
        // Update the state variable for preview images with the newly filtered array
        setPreviewImages(updatedPreviewImages);
    };


    return (
        <div className="shadow-inner rounded-lg h-full md:h-1/2 w-full bg-white flex flex-col items-center justify-center">
            <input
                type="file"
                id="upload"
                className="hidden"
                multiple
                onChange={handleFileSelect}
            />
            <label
                htmlFor="upload"
                className="bg-gray-600 text-white py-2 px-4 rounded-lg cursor-pointer"
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
                            <Image src={path} alt="Preview" fill className="w-full h-auto" />
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
