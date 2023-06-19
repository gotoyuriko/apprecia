import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IconContext } from "react-icons";
import { BiUserCircle } from "react-icons/bi";

export default function ProfileSection({ userData }) {
    const router = useRouter();

    const [editMode, setIsEditMode] = useState(false);

    // State of form data attribute
    const [formData, setFormData] = useState({
        fullname: "",
        bio: "",
        photoURL: ""
    });

    useEffect(() => {
        if (userData) {
            setFormData({
                fullname: userData?.user_name || '',
                bio: userData?.user_bio || '',
                photoURL: userData?.user_photoURL || ''
            });
        }
    }, [userData]);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        setFormData({ ...formData, photoURL: URL.createObjectURL(file) });
    };

    const handleDeleteProfilePhoto = () => {
        if (window.confirm("Are you sure you want to delete the profile photo?")) {
            setFormData({ ...formData, photoURL: "" });
        }
    };

    if (editMode) {
        return (
            <div className="flex flex-col w-full px-5 md:40 lg:px-80">
                {/* Profile Icon */}
                <div className="flex items-center justify-between p-3">
                    <IconContext.Provider
                        value={{
                            size: "3.5rem",
                            className: "text-center",
                            title: "Profile menu",
                        }}
                    >
                        <label htmlFor="photoUpload">
                            {formData.photoURL ? (
                                <Image
                                    width={50}
                                    height={50}
                                    src={formData.photoURL}
                                    alt="Profile"
                                    className="w-16 h-16 rounded-full"
                                    priority
                                />
                            ) : (
                                <BiUserCircle />
                            )}
                        </label>
                        <input
                            id="photoUpload"
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            style={{ display: "none" }}
                        />
                    </IconContext.Provider>
                    <div>
                        <button
                            className="bg-gray-800 shadow hover:bg-gray-700 text-white text-sm md:font-bold py-2 px-2 md:px-3 rounded mr-2 md:mr-5"
                            onClick={() => document.getElementById("photoUpload").click()}
                        >
                            Upload New
                        </button>
                        <button
                            className="bg-gray-500 shadow hover:bg-gray-600 text-white text-sm md:font-bold py-2 px-2 md:px-3 rounded"
                            onClick={handleDeleteProfilePhoto}
                        >
                            Delete
                        </button>
                    </div>
                </div>
                {/* Edit Profile */}
                <input
                    onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                    value={formData.fullname}
                    placeholder="Full Name"
                    required
                    className="block w-full rounded-md border-0 py-3 text-gray-900 placeholder:text-gray-200
                                        shadow-sm indent-2.5 placeholder:text-gray-500 text-base"
                />
                <textarea
                    className="block w-full rounded-md border-0 py-3 text-gray-900 placeholder:text-gray-200 
                                        shadow-sm indent-2.5 placeholder:text-gray-500 text-base h-40 mt-5"
                    rows="4"
                    value={formData.bio}
                    placeholder="Bio - Tell me your story"
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value, })}
                    required
                />
                <div className="flex justify-center mt-3">
                    <button
                        onClick={() => setIsEditMode(!editMode)}
                        className="bg-gray-500 shadow hover:bg-gray-600 text-white text-sm md:font-bold py-2 px-2 md:px-3 rounded mr-3"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => setIsEditMode(!editMode)}
                        className="bg-gray-800 shadow hover:bg-gray-700 text-white text-sm md:font-bold py-2 px-2 md:px-3 rounded mr-2 md:mr-5"
                    >
                        Save Profile
                    </button>
                </div>

            </div>
        )
    } else {
        return (
            <div className="flex flex-col lg:flex-row justify-around items-center">
                {/* Profile Information */}
                <div className="flex flex-row items-center">
                    {/* Profile Icon */}
                    <div className="flex items-center justify-center">
                        <IconContext.Provider
                            value={{
                                size: "3.5rem",
                                className: "text-center",
                                title: "Profile menu",
                            }}
                        >
                            {userData?.user_photoURL ? (
                                <Image
                                    width={50}
                                    height={50}
                                    src={userData.user_photoURL}
                                    alt="Profile"
                                    className="w-16 h-16 rounded-full"
                                    priority
                                />
                            ) : (
                                <BiUserCircle />
                            )}
                        </IconContext.Provider>
                    </div>
                    {/* Edit Profile */}
                    <div className="flex flex-col justify-start ml-5">
                        <div className="flex flex-row items-center">
                            <h1 className="text-2xl font-bold mr-3">{userData?.user_name}</h1>
                            <button
                                onClick={() => setIsEditMode(!editMode)}
                                className="bg-gray-300 shadow hover:bg-gray-400 font-bold text-sm py-2 px-2 rounded"
                            >
                                Edit Profile
                            </button>
                        </div>
                        <p className={`text-gray-600 text-justify max-w-lg ${userData?.user_bio != "" ? 'ml-2 mt-4 block' : 'ml-0 mt-0 hidden'}`}>
                            {userData?.user_bio}
                        </p>
                    </div>
                </div>

                {/* Create Project Button */}
                <div className="flex flex-row mt-5 lg:mt-0">
                    <button
                        onClick={() => router.push("/newproject")}
                        className="bg-gray-800 shadow hover:bg-gray-700 text-white font-bold py-2 px-3 rounded mr-5"
                    >
                        Create Project
                    </button>
                    <button
                        onClick={() => router.push("/newroom")}
                        className="bg-gray-500 shadow hover:bg-gray-600 text-white font-bold py-2 px-3 rounded"
                    >
                        Create Room
                    </button>

                </div>
            </div>
        )
    }

}