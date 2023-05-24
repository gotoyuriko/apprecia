import ArtworkCard from "@/components/ArtworkCard";
import Footer from "@/components/Footer";
import Navbar from "@/components/Nav/Navbar";
import Image from "next/image";

export default function Profile() {
    const currentUser = {
        username: "John Doe",
        bio: "Art enthusiast",
        profileIcon: "/appreciabg.png",
        savedArt: [], // Array of saved artwork objects
        likedArt: [] // Array of liked artwork objects
    };

    return (
        <div className="w-full">
            <Navbar user={currentUser} />

            <div className="container mx-auto py-8">
                <div className="flex items-center justify-center">
                    <Image src={currentUser.profileIcon} width={200} height={200} alt="Profile Icon" className="w-16 h-16 rounded-full" />
                </div>

                <h1 className="text-2xl font-bold text-center mt-4">{currentUser.username}</h1>

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
