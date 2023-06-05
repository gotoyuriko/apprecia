import React, { useState, useRef } from 'react';
import Image from 'next/image';
import CreatableSelect from 'react-select/creatable';
import { v4 as uuid } from 'uuid';
import { addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/firebase/Config';
import { tagOptions, skillOptions } from '@/data/data';

const Project = ({ user }) => {
    const [projectData, setProjectData] = useState({
        title: '',
        description: '',
        tags: [],
        skills: [],
        projectLink: '',
        uid: user.uid
    });

    const [images, setImages] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const selectFiles = () => {
        fileInputRef.current.click();
    };

    const onFileSelect = (event) => {
        const files = event.target.files;
        if (files.length === 0) return;
        for (let index = 0; index < files.length; index++) {
            const file = files[index];
            if (file.type.split('/')[0] !== 'image') {
                alert('Please upload an image');
                continue;
            }
            if (file.size > 10 * 1024 * 1024) {
                alert('File size exceeds the limit: ' + file.name);
                continue;
            }
            if (!images.some((e) => e.name === file.name)) {
                setImages((prevImages) => [
                    ...prevImages,
                    {
                        name: file.name,
                        url: URL.createObjectURL(file),
                    },
                ]);
            }
        }
    };

    const deleteImage = (index) => {
        setImages((prevImages) => prevImages.filter((image, i) => i !== index));
    };

    const onDragOver = (event) => {
        event.preventDefault();
        setIsDragging(true);
        event.dataTransfer.dropEffect = 'copy';
    };

    const onDragLeave = (event) => {
        event.preventDefault();
        setIsDragging(false);
    };

    const onDrop = (event) => {
        event.preventDefault();
        setIsDragging(false);
        const files = event.dataTransfer.files;
        for (let index = 0; index < files.length; index++) {
            const file = files[index];
            if (file.type.split('/')[0] !== 'image') {
                alert('Please upload an image');
                continue;
            }
            if (file.size > 10 * 1024 * 1024) {
                alert('File size exceeds the limit: ' + file.name);
                continue;
            }
            if (!images.some((e) => e.name === file.name)) {
                setImages((prevImages) => [
                    ...prevImages,
                    {
                        name: file.name,
                        url: URL.createObjectURL(file),
                    },
                ]);
            }
        }
    };

    const uploadProjectData = () => {
        // Upload Image to Firebase Storage
        if (images == null || images.length === 0) return;

        const imageRef = ref(storage, `projectArtwork/${images[0].name + uuid()}`);
        uploadBytes(imageRef, images[0])
            .then(() => {
                getDownloadURL(imageRef)
                    .then((downloadURL) => {
                        const projectDataWithImage = {
                            ...projectData,
                            imageUrl: downloadURL, // Rename the field to "imageUrl"
                        };

                        addDoc(collection(db, 'artProjects'), projectDataWithImage)
                            .then(() => {
                                console.log('Project Data Saved');
                            })
                            .catch((error) => {
                                console.error('Error adding document: ', error);
                            });
                    })
                    .catch((error) => {
                        console.error('Error getting download URL: ', error);
                    });
            })
            .catch((error) => {
                console.error('Error uploading image: ', error);
            });
    };

    return (
        <div className="min-h-screen py-5">
            <h1 className="text-4xl font-bold text-center lg:text-start py-5 px-10">
                Create New Project
            </h1>
            <div className="flex flex-col md:flex-row">
                <div className="flex-1 px-5 pb-5 lg:p-10">
                    {/* Upload Area */}
                    <div
                        className="shadow-inner rounded-lg h-48 md:h-96 w-full bg-gray-100 border-2 border-dashed border-gray-800 text-gray-600 font-bold flex justify-center items-center select-none mt-2.5"
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                    >
                        {isDragging ? (
                            <p className="font-bold text-gray-600">Drag & Drop Image Uploading</p>
                        ) : (
                            <>
                                <span className="mr-2 hover:opacity-60">Drag Images Here</span>
                                <span className="mr-2">or</span>
                                <span
                                    className="ml-2 hover:opacity-60"
                                    role="button"
                                    onClick={selectFiles}
                                >
                                    Browse
                                </span>
                            </>
                        )}
                        <input
                            name="file"
                            type="file"
                            multiple
                            className="hidden"
                            ref={fileInputRef}
                            onChange={onFileSelect}
                        />
                    </div>

                    {/* Preview Images */}
                    <div className="w-full h-auto flex justify-start items-start flex-wrap max-h-52 overflow-y-auto mt-2.5">
                        {images.map((image, index) => (
                            <div
                                className="w-[75px] h-[75px] lg:w-[100px] lg:h-[100px] mr-1 relative mb-2"
                                key={index}
                            >
                                <span
                                    className="absolute top-[-8px] right-0 text-[20px] cursor-pointer z-50"
                                    onClick={() => deleteImage(index)}
                                >
                                    &times;
                                </span>
                                <Image src={image.url} alt={image.name} fill className="object-cover rounded" />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex-1 w-full h-full px-5">
                    <div className="mb-4">
                        <h1 className="text-xl text-gray-500">Project Title</h1>
                        <input
                            className="w-full h-10 px-3 text-base font-bold placeholder-gray-600 border rounded-lg focus:shadow-outline"
                            type="text"
                            value={projectData.title}
                            onChange={(e) => setProjectData({ ...projectData, title: e.target.value })}
                        />
                    </div>
                    <div className="mb-4">
                        <h1 className="text-xl text-gray-500">Description</h1>
                        <textarea
                            className="w-full h-40 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline"
                            rows="4"
                            value={projectData.description}
                            onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
                        />
                    </div>
                    <div className="mb-4">
                        <h1 className="text-xl text-gray-500">Tags</h1>
                        <CreatableSelect
                            isMulti
                            options={tagOptions}
                            value={projectData.tags}
                            onChange={(selectedOptions) => setProjectData({ ...projectData, tags: selectedOptions })}
                        />
                    </div>
                    <div className="mb-4">
                        <h1 className="text-xl text-gray-500">Skill</h1>
                        <CreatableSelect
                            isMulti
                            options={skillOptions}
                            value={projectData.skills}
                            onChange={(selectedOptions) => setProjectData({ ...projectData, skills: selectedOptions })}
                        />
                    </div>
                    <div className="mb-6">
                        <h1 className="text-xl text-gray-500">Project Link (If Applicable)</h1>
                        <input
                            className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline"
                            type="url"
                            placeholder="Paste a hyperlink"
                            value={projectData.projectLink}
                            onChange={(e) => setProjectData({ ...projectData, projectLink: e.target.value })}
                        />
                    </div>
                    <div className="mb-4">
                        <button
                            className="w-full h-10 px-3 text-base text-white bg-black border rounded-lg focus:shadow-outline"
                            role='button'
                            onClick={uploadProjectData}
                        >
                            Create Project
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Project;