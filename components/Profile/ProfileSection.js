import { useEffect, useRef, useState } from "react";
import { IconContext } from "react-icons";
import { BiUserCircle } from "react-icons/bi";
import Image from "next/image";
import { useRouter } from "next/router";
import UpdateUser from "@/firebase/users/UpdateUser";
import { deleteObject, ref } from "firebase/storage";
import { storage } from "@/firebase/Config";
import { useAuth } from "@/firebase/auth/AuthContext";

export default function ProfileSection({ userData, setUserData, slug }) {
    const { currentUser } = useAuth();
    const router = useRouter();
    const fileInputRef = useRef(null);
    const [editMode, setEditMode] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [formData, setFormData] = useState({
        fullname: "",
        bio: "",
        photoURL: "",
    });

    useEffect(() => {
        if (userData) {
            setFormData({
                fullname: userData?.user_name || "",
                bio: userData?.user_bio || "",
                photoURL: userData?.user_photoURL || "",
            });
        }
    }, [userData]);

    const handleProfilePhotoUpload = (event) => {
        const file = event.target.files[0];

        if (file && file.type.includes("image/")) {
            const maxFileSize = 10 * 1024 * 1024; // 10MB

            if (file.size <= maxFileSize) {
                setProfileImage(file);
                setFormData({ ...formData, photoURL: URL.createObjectURL(file) });
            } else {
                alert("Please select an image file smaller than 10MB.");
            }
        } else {
            alert("Please select a valid image file.");
        }
    };

    const handleDeleteProfilePhoto = async () => {
        if (window.confirm("Are you sure you want to delete the profile photo?")) {
            try {
                if (
                    userData &&
                    userData.user_photoURL &&
                    !userData.user_photoURL.startsWith(
                        "https://lh3.googleusercontent.com/"
                    )
                ) {
                    const photoRef = ref(storage, userData.user_photoURL);
                    await deleteObject(photoRef);
                }
                // Update the formData with an empty photoURL
                setFormData({ ...formData, photoURL: "" });
            } catch (error) {
                console.error("Error deleting profile photo:", error);
            }
        }

        fileInputRef.current.value = null;
    };

    const handleUpdateProfile = async () => {
        try {
            await UpdateUser(formData, profileImage, userData.user_id);
            const updatedUserData = {
                ...userData,
                user_name: formData.fullname,
                user_bio: formData.bio,
                user_photoURL: formData.photoURL,
            };
            setUserData(updatedUserData);

            router.reload();
        } catch (error) {
            console.error("Error updating user profile:", error);
        }
    };

    if (editMode) {
        return (
            <div className="flex flex-col w-full px-5 md:40 lg:px-80">
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
                                    className="w-16 h-16 rounded-full object-cover"
                                    priority
                                />
                            ) : (
                                <BiUserCircle />
                            )}
                        </label>
                        <input
                            ref={fileInputRef}
                            id="photoUpload"
                            type="file"
                            accept="image/*"
                            onChange={handleProfilePhotoUpload}
                            style={{ display: "none" }}
                        />
                    </IconContext.Provider>
                    <div>
                        <button
                            className="bg-gray-800 shadow hover:bg-gray-700 text-white text-sm md:font-bold py-2 px-2 md:px-3 rounded mr-2 md:mr-5"
                            onClick={() => fileInputRef.current.click()}
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
                <input
                    onChange={(e) =>
                        setFormData({ ...formData, fullname: e.target.value })
                    }
                    value={formData.fullname}
                    placeholder="Full Name"
                    required
                    className="block w-full rounded-md border-0 py-3 text-gray-900 placeholder:text-gray-200 shadow-sm indent-2.5 placeholder:text-gray-500 text-base"
                />
                <textarea
                    className="block w-full rounded-md border-0 py-3 text-gray-900 placeholder:text-gray-200 shadow-sm indent-2.5 placeholder:text-gray-500 text-base h-40 mt-5"
                    rows="4"
                    value={formData.bio}
                    placeholder="Bio - Tell me your story"
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    required
                />
                <div className="flex justify-center mt-3">
                    <button
                        onClick={() => setEditMode(!editMode)}
                        className="bg-gray-500 shadow hover:bg-gray-600 text-white text-sm md:font-bold py-2 px-2 md:px-3 rounded mr-3"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleUpdateProfile}
                        className="bg-gray-800 shadow hover:bg-gray-700 text-white text-sm md:font-bold py-2 px-2 md:px-3 rounded mr-2 md:mr-5"
                    >
                        Save Profile
                    </button>
                </div>
            </div>
        );
    } else {
        return (
            <div className="flex flex-col lg:flex-row justify-around items-center">
                <div className="flex flex-row items-center">
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
                                    className="w-16 h-16 rounded-full object-cover"
                                    priority
                                    style={{ borderRadius: "50%", aspectRatio: "1/1" }}
                                />
                            ) : (
                                <BiUserCircle />
                            )}
                        </IconContext.Provider>
                    </div>
                    <div className="flex flex-col justify-start ml-5">
                        <div className="flex flex-row items-center">
                            <h1 className="text-2xl font-bold mr-3">{userData?.user_name}</h1>
                            {currentUser && currentUser.uid === slug &&
                                < button
                                    onClick={() => setEditMode(!editMode)}
                                    className="bg-gray-300 shadow hover:bg-gray-400 font-bold text-sm py-2 px-2 rounded"
                                >
                                    Edit Profile
                                </button>
                            }
                        </div>
                        <p className={`text-gray-600 text-justify max-w-lg break-words ${userData?.user_bio !== "" ? "ml-1 mt-1 block pr-5 md:pr-0" : "ml-0 mt-0 hidden"}`}>
                            {userData?.user_bio}
                        </p>
                    </div>
                </div>
                {
                    currentUser && currentUser.uid === slug &&
                    <div className="flex flex-row mt-5 lg:mt-0">
                        <button
                            onClick={() => router.push("/newproject")}
                            className="bg-gray-800 shadow hover:bg-gray-700 text-white font-bold py-2 px-3 rounded mr-5"
                        >
                            Create Project
                        </button>
                        <button
                            onClick={() => router.push("/tour/newroom")}
                            className="bg-gray-500 shadow hover:bg-gray-600 text-white font-bold py-2 px-3 rounded"
                        >
                            Create Room
                        </button>
                    </div>
                }
            </div >
        );
    }
}
