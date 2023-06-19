import Image from "next/image";
import { useRouter } from "next/router";
import { IconContext } from "react-icons";
import { BiUserCircle } from "react-icons/bi";

export default function ProfileSection({ userData }) {
    const router = useRouter();

    return (
        <div className="flex flex-col lg:flex-row justify-around items-center">
            <div className="flex flex-row items-center">
                <div className="flex items-center justify-center">
                    {/* Icon Photo */}
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
                <div className="flex flex-col justify-start ml-5">
                    <div className="flex flex-row items-center">
                        <h1 className="text-2xl font-bold mr-3">{userData?.user_name}</h1>
                        <button
                            onClick={() => router.push(`/profiles/edit/${userData?.user_id}`)}
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

            <div className="flex flex-row mt-5 lg:mt-0">
                <button
                    onClick={() => router.push("/newproject")}
                    className="bg-gray-800 shadow hover:bg-gray-700 text-white font-bold py-2 px-3
               rounded mr-5"
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