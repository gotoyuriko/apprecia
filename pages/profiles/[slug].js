import ArtworkCard from "@/components/ArtworkCard";
import Footer from "@/components/Footer";
import Navbar from "@/components/Nav/Navbar";
import GetArtwork from "@/firebase/GetArtwork";
import GetUser from "@/firebase/users/GetUser";
import { useAuth } from "@/firebase/auth/AuthContext";
import Image from "next/image";
import { useState, useEffect } from "react";
import { BiUserCircle } from "react-icons/bi";
import { useRouter } from "next/router";
import { IconContext } from "react-icons";

export default function Profile() {
    const router = useRouter();
    const { slug } = router.query;

    const { currentUser } = useAuth();
    const [userData, setUserData] = useState(null);
    const [artworkData, setArtworkData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await GetUser(slug);
                setUserData(userData);
            } catch (error) {
                console.error("Error getting user:", error);
            }

            try {
                const artworkData = await GetArtwork();
                setArtworkData(artworkData);
            } catch (error) {
                console.error("Error getting artwork:", error);
            }
        };

        if (slug) {
            fetchData();
        }
    }, [slug]);

    return (
        <div className="w-full">
            <Navbar user={currentUser} />
            <div className="container mx-auto py-8">
                <div className="flex justify-center items-center">
                    <div className="flex items-center justify-center">
                        {/* Profile */}
                        <IconContext.Provider
                            value={{
                                size: '3.5rem',
                                className: 'text-center',
                                title: 'Profile menu',
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
                        <h1 className="text-2xl font-bold">{userData?.user_name}</h1>
                        <p className="text-gray-600">{userData?.user_bio}</p>
                    </div>
                </div>
                {(artworkData?.length == 0) ?
                    <div className="h-[70vh] w-full flex justify-center items-center">
                        {currentUser ?
                            <div className="flex flex-col">
                                <p className="font-bold text-lg text-center">
                                    Your project showcase is empty. <br />
                                    Start uploading your projects now!<br />

                                </p>
                                <button
                                    onClick={() => router.push("/newproject")}
                                    className="mt-3 p-3 bg-black font-bold text-white rounded-lg inline-block">
                                    Create Project
                                </button>
                            </div> :
                            <p className="font-bold text-lg">
                                This user has no projects yet.
                            </p>
                        }
                    </div>
                    :
                    <div className="min-h-[70vh] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-3 lg:py-8 lg:px-20 my-10">
                        {
                            artworkData?.filter((artwork) => artwork.user_id === userData?.user_id).map((filteredArtwork, index) => (
                                <div key={index}>
                                    <ArtworkCard
                                        title={filteredArtwork.project_title}
                                        imageUrls={filteredArtwork.project_imageUrls}
                                        uid={filteredArtwork.user_id}
                                        description={filteredArtwork.project_description}
                                        tags={filteredArtwork.project_tags}
                                        link={filteredArtwork.project_link}
                                        skills={filteredArtwork.project_skills}
                                    />
                                </div>
                            ))
                        }
                    </div>
                }
            </div>
            <Footer />
        </div>
    );
}
