import { useState, useRef } from 'react';
import Image from 'next/image';
import CreatableSelect from 'react-select/creatable';
import { v4 as uuid } from 'uuid';
import { addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/firebase/Config';
import { tagOptions, skillOptions } from '@/data/data';
import { useRouter } from 'next/router';

const Project = ({ user }) => {
    const router = useRouter();

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
    const [isURLValid, setIsURLValid] = useState(true);
    const [errImgMsg, setErrImgMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const fileInputRef = useRef(null);

    const isButtonDisabled =
        images.length === 0 ||
        !projectData.title ||
        !projectData.description ||
        projectData.tags.length === 0 ||
        projectData.skills.length === 0;

    const selectFiles = () => {
        fileInputRef.current.click();
    };

    const onFileSelect = (event) => {
        const files = event.target.files;
        if (files.length === 0) return;
        for (let index = 0; index < files.length; index++) {
            const file = files[index];
            if (file.type.split('/')[0] !== 'image') {
                setErrImgMsg('Please upload an image');
                continue;
            }
            if (file.size > 10 * 1024 * 1024) {
                setErrImgMsg('File size exceeds the limit: ' + file.name);
                continue;
            }
            if (!images.some((e) => e.name === file.name)) {
                setImages((prevImages) => [
                    ...prevImages,
                    file,
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
                setErrImgMsg('Please upload an image');
                continue;
            }
            if (file.size > 10 * 1024 * 1024) {
                setErrImgMsg('File size exceeds the limit: ' + file.name);
                continue;
            }
            if (!images.some((e) => e.name === file.name)) {
                setImages((prevImages) => [
                    ...prevImages,
                    file,
                ]);
            }
        }
    };

    const validateURL = (url) => {
        if (url === "") return true;
        const pattern = /^(ftp|http|https):\/\/[^ "]+$/;
        return pattern.test(url);
    };


    const uploadProjectData = () => {
        // Validate Project Link
        const isURLValid = validateURL(projectData.projectLink);
        setIsURLValid(isURLValid);

        // Upload Images to Firebase Storage
        if (images == null || images.length === 0 || !isURLValid) return;

        // Get the current date and time
        const currentDate = new Date();
        const timestamp = currentDate.toISOString();

        // All image upload tasks are resolved as an array
        const uploadPromises = [];
        // Store imageUrls as an array
        const imageUrls = [];

        images.forEach((image) => {
            const imageRef = ref(storage, `projectArtwork/${image.name + uuid()}`);
            const uploadTask = uploadBytes(imageRef, image)
                .then(() => getDownloadURL(imageRef))
                .then((downloadURL) => {
                    imageUrls.push(downloadURL);
                });

            uploadPromises.push(uploadTask);
        });

        Promise.all(uploadPromises)
            .then(() => {
                const projectDataWithImages = {
                    title: projectData.title,
                    description: projectData.description,
                    tags: projectData.tags,
                    skills: projectData.skills,
                    projectLink: projectData.projectLink,
                    uid: projectData.uid,
                    createdAt: timestamp,
                    imageUrls: imageUrls,
                };

                addDoc(collection(db, 'artProjects'), projectDataWithImages)
                    .then(() => {
                        setSuccessMsg('Project Data Saved! Redirecting...');
                        setTimeout(() => {
                            setSuccessMsg('');
                            router.push('/profile');
                        }, 2000);
                    })
                    .catch((error) => {
                        console.error('Error adding document: ', error);
                        setSuccessMsg('');
                    });
            })
            .catch((error) => {
                console.error('Error uploading images: ', error);
                setSuccessMsg('');
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
                    <h1 className="text-xl text-gray-500">Upload Your Project Images<span className='text-red-600'>*</span></h1>
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
                                <span className="ml-2 hover:opacity-60" role="button" onClick={selectFiles} > Browse </span>
                            </>
                        )}
                        <input name="file" type="file" multiple className="hidden" ref={fileInputRef} onChange={onFileSelect} required />
                    </div>
                    <p className='text-red-600'>{errImgMsg}</p>

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
                                <Image src={URL.createObjectURL(image)} alt={image.name} fill className="object-cover rounded" />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex-1 w-full h-full px-5">
                    <div className="mb-4">
                        <h1 className="text-xl text-gray-500">Project Title<span className='text-red-600'>*</span></h1>
                        <input
                            className="w-full h-10 px-3 text-base font-bold placeholder-gray-600 border rounded-lg focus:shadow-outline"
                            type="text"
                            value={projectData.title}
                            onChange={(e) => setProjectData({ ...projectData, title: e.target.value })}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <h1 className="text-xl text-gray-500">Description<span className='text-red-600'>*</span></h1>
                        <textarea
                            className="w-full h-40 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline"
                            rows="4"
                            value={projectData.description}
                            onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <h1 className="text-xl text-gray-500">Tags<span className='text-red-600'>*</span></h1>
                        <CreatableSelect
                            isMulti
                            options={tagOptions}
                            value={projectData.tags}
                            onChange={(selectedOptions) => setProjectData({ ...projectData, tags: selectedOptions })}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <h1 className="text-xl text-gray-500">Skill<span className='text-red-600'>*</span></h1>
                        <CreatableSelect
                            isMulti
                            options={skillOptions}
                            value={projectData.skills}
                            onChange={(selectedOptions) => setProjectData({ ...projectData, skills: selectedOptions })}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <h1 className="text-xl text-gray-500">Project Link</h1>
                        <input
                            className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline"
                            type="url"
                            placeholder="Paste a hyperlink"
                            value={projectData.projectLink}
                            onChange={(e) => setProjectData({ ...projectData, projectLink: e.target.value })}
                        />
                        {isURLValid === false && (
                            <p className="text-red-500 text-sm mt-1">Please enter a valid URL</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <button
                            className={isButtonDisabled ? `w-full h-10 px-3 text-base text-white bg-gray-300 border rounded-lg` : `w-full h-10 px-3 text-base text-white bg-black border rounded-lg focus:shadow-outline hover:bg-gray-800`}
                            role='button'
                            onClick={uploadProjectData}
                            disabled={isButtonDisabled}
                        >
                            Create Project
                        </button>
                        <p className='text-green-600'>{successMsg}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Project;
