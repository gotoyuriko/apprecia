import { useState, useRef } from 'react';
import Image from 'next/image';
import CreatableSelect from 'react-select/creatable';
import { tagOptions, skillOptions } from '@/data/data';
import { useRouter } from 'next/router';
import { useDropzone } from 'react-dropzone';
import AddArtwork from '@/firebase/artworks/AddArtwork';

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
            backgroundColor: data.color ? data.color + '1a' : '#333333' + '1a',
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
                backgroundColor: data.color ? data.color : '#333333',
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
                setErrImgMsg('Invalid file(s) selected.');
            }
        } else {
            setErrImgMsg('Invalid file(s) selected.');
        }
    };

    // Drag and Drop props
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: onFileSelect,
        accept: 'image/*',
        maxSize: 10 * 1024 * 1024,
    });

    // Delete Preview Image
    const deleteImage = (index) => {
        setImages((prevImages) => prevImages.filter((__, i) => i !== index));
    };

    // Validate URL
    const validateURL = (url) => {
        if (url === "") return true;
        const pattern = /^(ftp|http|https):\/\/[^ "]+$/;
        return pattern.test(url);
    };

    // Upload All Inputs to Firebase
    const uploadProjectData = async () => {
        // Validate Project Link
        setIsURLValid(validateURL(projectData.project_link));

        // Check if images is not empty and URL is valid
        if (images == null || images.length === 0 || !isURLValid) return;

        const { result, error } = AddArtwork(images, projectData);

        if (error) {
            console.error("Error uploading images or adding document: ", error);
            setSuccessMsg("");
        } else {
            setSuccessMsg("Project Data Saved! Redirecting...");
            setTimeout(() => {
                setSuccessMsg("");
                router.push(`/profiles/${user.uid}`);
            }, 300);
        }
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        setFormData({ ...formData, photoURL: URL.createObjectURL(file) });
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
