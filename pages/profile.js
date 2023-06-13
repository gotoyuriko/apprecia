import ArtworkCard from "@/components/ArtworkCard";
import Footer from "@/components/Footer";
import Navbar from "@/components/Nav/Navbar";
import GetUser from "@/firebase/GetUser";
import { useAuth } from "@/firebase/auth/AuthContext";
import Image from "next/image";
import { useState, useEffect } from "react";
import { BiUserCircle } from "react-icons/bi";

export default function Profile() {
    const { currentUser } = useAuth();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        if (currentUser) {
            GetUser(currentUser.uid)
                .then((data) => {
                    console.log("Fetched Document Data");
                    // console.log(data);
                    setUserData(data);
                })
                .catch((error) => {
                    console.log("Error getting user:", error);
                });
        }
    }, [currentUser]);

    return (
        <div className="w-full">
            <Navbar user={currentUser} />

            <div className="container mx-auto py-8">
                <div className="flex items-center justify-center">
                    {userData?.user_photoURL ?
                        <Image
                            width={200}
                            height={200}
                            src={userData.user_photoURL}
                            alt="Profile Icon"
                            className="w-16 h-16 rounded-full"
                        /> :
                        <BiUserCircle />
                    }
                </div>

                <h1 className="text-2xl font-bold text-center mt-4">{userData?.user_name}</h1>
                <p className="text-center text-gray-600 mt-2">{userData?.user_bio}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    <div className="flex justify-center mt-8">
                        {/* Artwork components */}
                        <ArtworkCard />
                    </div>
                    <div className="flex justify-center mt-8">
                        {/* Saved and liked art components */}
                        <ArtworkCard />
                    </div>
                    <div className="flex justify-center mt-8">
                        {/* Saved and liked art components */}
                        <ArtworkCard />
                    </div>

                    <div className="flex justify-center mt-8">
                        {/* Saved and liked art components */}
                        <ArtworkCard />
                    </div>

                    <div className="flex justify-center mt-8">
                        {/* Artwork components */}
                        <ArtworkCard />
                    </div>
                    <div className="flex justify-center mt-8">
                        {/* Saved and liked art components */}
                        <ArtworkCard />
                    </div>
                    <div className="flex justify-center mt-8">
                        {/* Saved and liked art components */}
                        <ArtworkCard />
                    </div>

                    <div className="flex justify-center mt-8">
                        {/* Saved and liked art components */}
                        <ArtworkCard />
                    </div>
                </div>

            </div>

            <Footer />
        </div>
    );
}
