import ArtworkCard from "@/components/ArtworkCard";
import Footer from "@/components/Footer";
import Navbar from "@/components/Nav/Navbar";
import GetUser from "@/firebase/GetUser";
import GetUserArtwork from "@/firebase/GetUserArtwork";
import { useAuth } from "@/firebase/auth/AuthContext";
import Image from "next/image";
import { useState, useEffect } from "react";
import { BiUserCircle } from "react-icons/bi";

export default function Profile() {
    const { currentUser } = useAuth();
    const [userData, setUserData] = useState(null);
    const [artworkData, setArtworkData] = useState(null);

    useEffect(() => {
        if (currentUser) {
            GetUser(currentUser.uid)
                .then((data) => {
                    setUserData(data);
                })
                .catch((error) => {
                    console.error("Error getting user:", error);
                });
            GetUserArtwork(currentUser.uid)
                .then((data) => {
                    setArtworkData(data);
                })
                .catch((error) => {
                    console.error("Error getting user:", error);
                });
        }
    }, [currentUser]);

    return (
        <div className="w-full">
            <Navbar user={currentUser} />
            <div className="container mx-auto py-8">
                <div className="flex justify-center items-center">
                    <div className="flex items-center justify-center">
                        {userData?.user_photoURL ?
                            <Image
                                width={200}
                                height={200}
                                src={userData.user_photoURL}
                                alt="Profile Icon"
                                className="w-16 h-16 rounded-full"
                                priority
                            /> :
                            <BiUserCircle />
                        }
                    </div>
                    <div className="flex flex-col justify-start ml-5">
                        <h1 className="text-2xl font-bold">{userData?.user_name}</h1>
                        <p className="text-gray-600">{userData?.user_bio}</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-3 lg:py-8 lg:px-20">
                    {
                        artworkData && artworkData.map((item, index) => (
                            <div key={index}>
                                <ArtworkCard
                                    title={item.title}
                                    description={item.description}
                                    imageUrls={item.imageUrls}
                                    uid={item.uid}
                                />
                            </div>
                        ))
                    }
                </div>
            </div>
            <Footer />
        </div>
    );
}
