import { createElement, useState } from "react";
import { motion } from "framer-motion";
import ArtworkCard from "../ArtworkProject/ArtworkCard";
import { AiFillHeart } from 'react-icons/ai';
import { BsFillPaletteFill, BsFillBoxFill } from 'react-icons/bs';

export default function ArtworkSection({ artworkData, userData, currentUser }) {
    const [activeTab, setActiveTab] = useState("artwork");

    const data = [
        {
            label: "Artwork",
            value: "artwork",
            icon: BsFillPaletteFill,
        },
        {
            label: "Liked",
            value: "liked",
            icon: AiFillHeart,
        },
        {
            label: "Room",
            value: "room",
            icon: BsFillBoxFill,
        },
    ];

    const yourArtworks = artworkData?.filter((artwork) => artwork.user_id === userData?.user_id);
    const likedArtworks = artworkData?.filter((artwork) => artwork?.project_likedBy?.includes(currentUser.uid));

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
                                        onClick={() => router.push("/newproject")}
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
                if (likedArtworks?.length === 0) {
                    return (
                        <div className="h-[70vh] w-full flex justify-center items-center">
                            {currentUser ? (
                                <div className="flex flex-col">
                                    <p className="font-bold text-lg text-center">
                                        Artwork Section
                                    </p>
                                </div>
                            ) : (
                                <p className="font-bold text-lg">
                                    Test
                                </p>
                            )}
                        </div>
                    );
                } else {
                    return (
                        <>{artworkCotent(likedArtworks)}</>
                    );
                }
            case "room":
                // if (likedArtworks?.length === 0) {
                return (
                    <div className="h-[70vh] w-full flex justify-center items-center">
                        {currentUser ? (
                            <div className="flex flex-col">
                                <p className="font-bold text-lg text-center">
                                    Room Section
                                </p>
                            </div>
                        ) : (
                            <p className="font-bold text-lg">
                                Test
                            </p>
                        )}
                    </div>
                );
            // } else {
            // return (
            //     <>{artworkCotent(likedArtworks)}</>
            // )
            // }
            default:
                return null;
        }
    };

    const artworkCotent = (filteredArtworks) => {
        return (
            <div className="min-h-[70vh] w-screen grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mx-auto gap-5 px-3 py-8 lg:px-20">
                {filteredArtworks?.map((filteredArtwork, index) => (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        key={index}>
                        <ArtworkCard
                            title={filteredArtwork.project_title}
                            imageUrls={filteredArtwork.project_imageUrls}
                            uid={filteredArtwork.user_id}
                            description={filteredArtwork.project_description}
                            tags={filteredArtwork.project_tags}
                            link={filteredArtwork.project_link}
                            skills={filteredArtwork.project_skills}
                            createdAt={filteredArtwork.project_createdAt}
                            likesCount={filteredArtwork.project_likesCount ?? 0}
                            likedBy={filteredArtwork.project_likedBy ?? []}
                            viewsCount={filteredArtwork.project_viewsCount ?? 0}
                        />
                    </motion.div>
                ))}
            </div>
        )
    }

    return (
        <div className="py-5">
            {/* Tab */}
            <div className="flex justify-center px-2">
                {data.map(({ label, value, icon }) => (
                    <button
                        key={value}
                        className={`mx-2 px-4 py-2 rounded-md 
                            ${activeTab === value ? "bg-gray-800 text-white cursor-default" : "bg-gray-100 hover:bg-gray-500 hover:shadow hover:text-white"} `}
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
