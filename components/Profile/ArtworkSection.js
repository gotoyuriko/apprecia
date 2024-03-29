import { createElement, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AiFillHeart } from 'react-icons/ai';
import { BsFillPaletteFill, BsFillBoxFill } from 'react-icons/bs';
import { useRouter } from "next/router";
import GalleryCard from "../VirtualTour/GalleryCard";
import ArtworkProject from "../ArtworkProject/ArtworkProject";

export default function ArtworkSection({ artworkData, currentUserData, usersData, currentUser, galleryData, slug }) {
    const [activeTab, setActiveTab] = useState("artwork");
    const router = useRouter();

    const data = [
        {
            label: "Artwork",
            value: "artwork",
            icon: BsFillPaletteFill,
            style: `${currentUser ? 'block' : 'block'}`
        },
        {
            label: "Liked",
            value: "liked",
            icon: AiFillHeart,
            style: `${currentUser ? 'block' : 'hidden'}`
        },
        {
            label: "Gallery",
            value: "gallery",
            icon: BsFillBoxFill,
            style: `${currentUser ? 'block' : 'hidden'}`
        },
    ];

    const [yourArtworks, setYourArtworks] = useState(null);
    const [likedArtworks, setLikedArtworks] = useState(null);
    const [virtualArtGalleries, setVirtualArtGalleries] = useState(null);

    useEffect(() => {
        setYourArtworks(
            artworkData?.filter(
                (artwork) => artwork?.project_creator === currentUserData?.user_email
            )
        );
    }, [artworkData, currentUserData]);

    useEffect(() => {
        setLikedArtworks(
            artworkData?.filter((artwork) =>
                artwork?.project_likedBy?.includes(slug)
            )
        );
    }, [artworkData, slug]);

    useEffect(() => {
        setVirtualArtGalleries(
            galleryData?.filter((gallery) => gallery?.tour_user === currentUserData?.user_email)
        );
    }, [galleryData, currentUserData]);

    const tabContent = () => {
        switch (activeTab) {
            case "artwork":
                if (yourArtworks?.length === 0) {
                    return (
                        <div className="h-[70vh] w-full flex justify-center items-center">
                            {currentUser ? (
                                <div className="flex flex-col">
                                    <p className="font-bold text-lg text-center">
                                        Your project showcase is empty. <br />
                                        Start uploading your projects now!
                                    </p>
                                    <button
                                        onClick={() => router.push("/projects/newproject")}
                                        className="mt-3 p-3 bg-black hover:bg-gray-600 font-bold text-white rounded inline-block"
                                    >
                                        Create Project
                                    </button>
                                </div>
                            ) : (
                                <p className="font-bold text-lg">
                                    This user has no projects yet.
                                </p>
                            )}
                        </div>
                    );
                } else {
                    return (
                        <>{artworkCotent(yourArtworks)}</>
                    );
                }
            case "liked":
                if (currentUser !== null) {
                    if (likedArtworks?.length === 0) {
                        return (
                            <div className="h-[70vh] w-full flex justify-center items-center">
                                {currentUser ? (
                                    <div className="flex flex-col">
                                        <p className="font-bold text-lg text-center">
                                            Liked Section
                                        </p>
                                    </div>
                                ) : null}
                            </div>
                        );
                    } else {
                        return (
                            <>{artworkCotent(likedArtworks)}</>
                        );
                    }
                }

            case "gallery":
                if (!virtualArtGalleries || virtualArtGalleries.length === 0) {
                    // Render the content when virtualArtGalleries is null, undefined, or empty
                    return (
                        <div className="h-[70vh] w-full flex justify-center items-center">
                            {currentUser ? (
                                <div className="flex flex-col">
                                    <p className="font-bold text-lg text-center">
                                        Virtual Art Gallery Section
                                    </p>
                                </div>
                            ) : null}
                        </div>
                    );
                } else {
                    // Render the gallery cards when virtualArtGalleries have items
                    return (
                        <div className="min-h-[70vh] flex justify-center mx-auto px-4 sm:px-6 lg:px-8 py-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {virtualArtGalleries.map((gallery, index) => (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5 }}
                                        key={index}>
                                        <GalleryCard
                                            currentUserData={currentUserData}
                                            galleryItem={gallery}
                                            createdAt={gallery.tour_createdAt}
                                            currentUser={currentUser}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    );
                }
            default:
                return null;
        }
    };

    const artworkCotent = (filteredArtworks) => {
        return (
            <div className="min-h-[70vh] flex justify-center px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 w-full">
                    {filteredArtworks?.map((filteredArtwork, index) => (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className='max-h-[300px]'
                            key={index}>
                            <ArtworkProject
                                currentUser={currentUser}
                                artProjectItem={filteredArtwork} // 1 art project
                                usersData={usersData} // all users

                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="py-5">
            {/* Tab */}
            <div className="flex justify-center px-2">
                {data.map(({ label, value, icon, style }) => (
                    <button
                        key={value}
                        className={`mx-2 px-4 py-2 rounded-md 
                            ${activeTab === value ? "bg-gray-800 text-white cursor-default" : "bg-gray-100 hover:bg-gray-500 hover:shadow hover:text-white"} ${style}`}
                        onClick={() => setActiveTab(value)}
                    >
                        <div className="flex items-center">
                            {createElement(icon, { className: "w-5 h-5 mr-2" })}
                            <span className="mt-1">{label}</span>
                        </div>
                    </button>
                ))}
            </div>
            {tabContent()}
        </div>
    );
}
