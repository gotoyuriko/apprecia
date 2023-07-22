import Image from "next/image";
import { IconContext } from "react-icons";
import { BiUserCircle } from "react-icons/bi";

export default function UserInfo({ tourUser }) {
    return (
        <div className="absolute z-10 top-5 left-5 flex flex-col md:flex-row md:items-center">
            <div className="flex items-center justify-center">
                <IconContext.Provider
                    value={{
                        size: "3.5rem",
                        className: "text-center",
                        title: "Profile menu",
                        color: 'white'
                    }}
                >
                    {tourUser?.user_photoURL ? (
                        <Image
                            width={50}
                            height={50}
                            src={tourUser.user_photoURL}
                            alt="Profile"
                            className="w-16 h-16 rounded-full object-cover shadow-lg"
                            priority
                            style={{ borderRadius: "50%", aspectRatio: "1/1" }}
                        />
                    ) : (
                        <BiUserCircle />
                    )}
                </IconContext.Provider>
            </div>
            <h1 className="text-sm md:text-2xl font-bold text-white ml-3">{tourUser?.user_name}</h1>
        </div>
    )
}