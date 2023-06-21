import { createElement, useState } from "react";
import { motion } from "framer-motion";
import { IoSquareOutline, IoSettingsOutline } from "react-icons/io5";
import ArtworkCard from "../ArtworkProject/ArtworkCard";

export default function ArtworkSection({ artworkData, userData, currentUser }) {
    const [activeTab, setActiveTab] = useState("artwork");

    const data = [
        {
            label: "Artwork",
            value: "artwork",
            icon: IoSquareOutline,
        },
        {
            label: "Liked",
            value: "liked",
            icon: IoSettingsOutline,
        },
    ];

    const filteredArtworks = artworkData?.filter(
        (artwork) => artwork.user_id === userData?.user_id
    );
    const likedArtworks = artworkData?.filter((artwork) =>
        userData?.user_likedArtworks?.includes(artwork.artwork_id)
    );

    return (
        <div className="space-y-2">
            <div className="flex space-x-2">
                {data.map(({ label, value, icon }) => (
                    <button
                        key={value}
                        className={`px-4 py-2 rounded-md ${activeTab === value ? "bg-gray-200" : "bg-gray-100"
                            } hover:bg-gray-200`}
                        onClick={() => setActiveTab(value)}
                    >
                        <div className="flex items-center space-x-2">
                            {createElement(icon, { className: "w-5 h-5" })}
                            <span>{label}</span>
                        </div>
                    </button>
                ))}
            </div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                {activeTab === "artwork" && filteredArtworks?.length === 0 ? (
                    <div className="h-[70vh] w-full flex justify-center items-center">
                        {currentUser ? (
                            <div className="flex flex-col">
                                <p className="font-bold text-lg text-center">
                                    Liked Section
                                </p>
                            </div>
                        ) : (
                            <p className="font-bold text-lg">
                                Test
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="min-h-[70vh] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-3 lg:py-8 lg:px-20 my-10">
                        {filteredArtworks?.map((filteredArtwork, index) => (
                            <div key={index}>
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
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === "liked" && likedArtworks?.length === 0 ? (
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
                ) : (
                    <div className="min-h-[70vh] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-3 lg:py-8 lg:px-20 my-10">
                        {filteredArtworks?.map((filteredArtwork, index) => (
                            <div key={index}>
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
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
