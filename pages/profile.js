import ArtworkCard from "@/components/ArtworkCard";
import Footer from "@/components/Footer";
import Navbar from "@/components/Nav/Navbar";
import { useAuth } from "@/firebase/auth/AuthContext";
import Image from "next/image";
import { BiUserCircle } from "react-icons/bi";

export default function Profile() {
    const { currentUser } = useAuth();

    return (
        <div className="w-full">
            <Navbar user={currentUser} />

            <div className="container mx-auto py-8">
                <div className="flex items-center justify-center">
                    {currentUser?.photoURL ?
                        <Image
                            width={200}
                            height={200}
                            src={currentUser.photoURL}
                            alt="Profile Icon"
                            className="w-16 h-16 rounded-full"
                        /> :
                        <BiUserCircle />
                    }
                </div>

                <h1 className="text-2xl font-bold text-center mt-4">{currentUser.displayName}</h1>

                <p className="text-center text-gray-600 mt-2">{currentUser.bio}</p>

                <div className="flex justify-center mt-8">
                    {/* Artwork components */}
                    <ArtworkCard />
                </div>

                <div className="flex justify-center mt-8">
                    {/* Saved and liked art components */}
                    <ArtworkCard />
                </div>
            </div>

            <Footer />
        </div>
    );
}
