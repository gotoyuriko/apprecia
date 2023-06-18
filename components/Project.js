import { useState, useRef } from 'react';
import Image from 'next/image';
import CreatableSelect from 'react-select/creatable';
import { v4 as uuid } from 'uuid';
import { addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/firebase/Config';
import { tagOptions, skillOptions } from '@/data/data';
import { useRouter } from 'next/router';
import { useDropzone } from 'react-dropzone';

const Project = ({ user }) => {
    const router = useRouter();

    const [projectData, setProjectData] = useState({
        project_title: '',
        project_description: '',
        project_tags: [],
        project_skills: [],
        project_link: '',
        user_id: user.uid,
        project_createdAt: '',
        project_imageUrls: []
    });

    const [images, setImages] = useState([]);
    const [isURLValid, setIsURLValid] = useState(true);
    const [errImgMsg, setErrImgMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const fileInputRef = useRef(null);

    const isButtonDisabled =
        images.length === 0 ||
        !projectData.project_title ||
        !projectData.project_description ||
        projectData.project_tags.length === 0 ||
        projectData.project_skills.length === 0;

    const customStyles = {
        control: (styles) => ({ ...styles, backgroundColor: 'white' }),
        multiValue: (styles, { data }) => ({
            ...styles,
            backgroundColor: data.color + '1a',
            // Apply transparency to the background color for multi-values
        }),
        multiValueLabel: (styles, { data }) => ({
            ...styles,
            color: data.color,
        }),
        multiValueRemove: (styles, { data }) => ({
            ...styles,
            color: data.color,
            ':hover': {
                backgroundColor: data.color,
                color: 'white',
            },
        }),
    }

    const selectFiles = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const onFileSelect = (acceptedFiles) => {
        if (Array.isArray(acceptedFiles)) {
            const validatedFiles = acceptedFiles.filter((file) => {
                // Validate file types
                const acceptedTypes = ['image/jpeg', 'image/png', 'image/gif'];
                const isValidType = acceptedTypes.includes(file.type);

                // Validate file size
                const maxSize = 5 * 1024 * 1024; // 5MB
                const isValidSize = file.size <= maxSize;

                return isValidType && isValidSize;
            });

            // validated files
            if (validatedFiles.length > 0) {
                setImages((prevImages) => [...prevImages, ...validatedFiles]);
            } else {
                console.log('Invalid file(s) selected.');
            }
        } else {
            console.log('Invalid file(s) selected.');
        }
    };

    // Drag and Drop props
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: onFileSelect,
        accept: 'image/*',
        maxSize: 10 * 1024 * 1024,
    });

    const deleteImage = (index) => {
        setImages((prevImages) => prevImages.filter((image, i) => i !== index));
    };

    const validateURL = (url) => {
        if (url === "") return true;
        const pattern = /^(ftp|http|https):\/\/[^ "]+$/;
        return pattern.test(url);
    };

    const uploadProjectData = () => {
        // Validate Project Link
        const isURLValid = validateURL(projectData.project_link);
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
                const updatedProjectData = {
                    ...projectData,
                    project_createdAt: timestamp,
                    project_imageUrls: imageUrls,
                };

                // Filter out invalid keys in tags and skills arrays
                updatedProjectData.project_tags = updatedProjectData.project_tags.map((tag) => {
                    const { label, value } = tag;
                    return { label: label.replace(/^__/i, ""), value };
                });

                updatedProjectData.project_skills = updatedProjectData.project_skills.map((skill) => {
                    const { label, value } = skill;
                    return { label: label.replace(/^__/i, ""), value };
                });

                addDoc(collection(db, "artProjects"), updatedProjectData)
                    .then(() => {
                        setSuccessMsg("Project Data Saved! Redirecting...");
                        setTimeout(() => {
                            setSuccessMsg("");
                            router.push(`/profiles/${user.uid}`);
                        }, 500);
                    })
                    .catch((error) => {
                        console.error("Error adding document: ", error);
                        setSuccessMsg("");
                    });
            })
            .catch((error) => {
                console.error("Error uploading images: ", error);
                setSuccessMsg("");
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
                        {...getRootProps({ multiple: true })}
                        className={`shadow-inner rounded-lg h-48 md:h-96 w-full bg-gray-100 border-2 border-dashed border-gray-800 text-gray-600 font-bold flex justify-center items-center select-none mt-2.5 ${isDragActive ? 'border-blue-600' : ''}`}
                    >
                        <input {...getInputProps()} />
                        {isDragActive ? (
                            <p className="font-bold text-gray-600">Drop the files here...</p>
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
                    {/* Title */}
                    <div className="mb-4">
                        <h1 className="text-xl text-gray-500">Project Title<span className='text-red-600'>*</span></h1>
                        <input
                            className="w-full h-10 px-3 text-base font-bold placeholder-gray-600 border rounded-lg focus:shadow-outline"
                            type="text"
                            value={projectData.project_title}
                            onChange={(e) =>
                                setProjectData((prevData) => ({
                                    ...prevData,
                                    project_title: e.target.value,
                                }))
                            }
                            required
                        />
                    </div>
                    {/* Description */}
                    <div className="mb-4">
                        <h1 className="text-xl text-gray-500">Description<span className='text-red-600'>*</span></h1>
                        <textarea
                            className="w-full h-40 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline"
                            rows="4"
                            value={projectData.project_description}
                            onChange={(e) =>
                                setProjectData((prevData) => ({
                                    ...prevData,
                                    project_description: e.target.value,
                                }))
                            }
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <h1 className="text-xl text-gray-500">Tags<span className='text-red-600'>*</span></h1>
                        <CreatableSelect
                            isMulti
                            options={tagOptions}
                            value={projectData.project_tags}
                            onChange={(selectedOptions) =>
                                setProjectData((prevData) => ({
                                    ...prevData,
                                    project_tags: selectedOptions,
                                }))
                            }
                            styles={customStyles}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <h1 className="text-xl text-gray-500">Skill<span className='text-red-600'>*</span></h1>
                        <CreatableSelect
                            isMulti
                            options={skillOptions}
                            value={projectData.project_skills}
                            onChange={(selectedOptions) =>
                                setProjectData((prevData) => ({
                                    ...prevData,
                                    project_skills: selectedOptions,
                                }))
                            }
                            styles={customStyles}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <h1 className="text-xl text-gray-500">Project Link</h1>
                        <input
                            className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline"
                            type="url"
                            placeholder="Paste a hyperlink"
                            value={projectData.project_link}
                            onChange={(e) =>
                                setProjectData((prevData) => ({
                                    ...prevData,
                                    project_link: e.target.value,
                                }))
                            }
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
