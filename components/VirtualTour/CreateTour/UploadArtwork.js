import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import { BiX } from "react-icons/bi";

export default function UploadArtwork({
    user,
    openModalArt,
    setOpenModalArt,
    artworkData,
    selectPanel,
    setSelectPanel,
    setTourData,
    roomNo
}) {
    const [selectedImage, setSelectedImage] = useState(null);

    const filteredCurrentUserArtwork = artworkData.filter(
        (artwork) => artwork.user_id === user.uid
    );

    const handleSelectArtwork = (url) => {
        setSelectPanel((prev) => ({ ...prev, [0]: { ...prev[0], src: url } }));
        setTourData((prevTourData) => {
            const updatedRoomArtwork = prevTourData.tour_room.map((room) => {
                if (room.room_id === roomNo) {
                    const updatedArtwork = room.room_artwork.map((artworkItem) => {
                        if (artworkItem.artworkId === selectPanel[0]?.artworkId) {
                            return { ...artworkItem, src: url };
                        }
                        return artworkItem;
                    });
                    return { ...room, room_artwork: updatedArtwork };
                }
                return room;
            });

            return {
                ...prevTourData,
                tour_room: updatedRoomArtwork,
            };
        });

        setSelectedImage("");
        setOpenModalArt(false);
    };

    const handleDeleteArtwork = () => {
        setSelectPanel((prev) => ({ ...prev, [0]: { ...prev[0], src: "" } }));
        setTourData((prevTourData) => {
            const updatedRoomArtwork = prevTourData.tour_room.map((room) => {
                if (room.room_id === roomNo) {
                    const updatedArtwork = room.room_artwork.map((artworkItem) => {
                        if (artworkItem.artworkId === selectPanel[0]?.artworkId) {
                            return { ...artworkItem, src: "" };
                        }
                        return artworkItem;
                    });
                    return { ...room, room_artwork: updatedArtwork };
                }
                return room;
            });

            return {
                ...prevTourData,
                tour_room: updatedRoomArtwork,
            };
        });

        setSelectedImage("");
        setOpenModalArt(false);
    };


    const isButtonDisabled = selectedImage === null;

    return (
        openModalArt && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 100 }}
                exit={{ opacity: 0 }}
                transition={{ ease: "easeOut", duration: 0.3 }}
                className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-80 bg-gray-900"
            >
                <motion.div
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    exit={{ y: 100 }}
                    transition={{ ease: "easeOut", duration: 0.3 }}
                    className="bg-white w-full lg:w-5/6 h-full lg:h-5/6 rounded-lg py-6 px-10 overflow-y-scroll md:overflow-y-hidden"
                >
                    <div className="flex items-center justify-between pb-5">
                        <p className="font-bold text-2xl ">
                            Select your artwork to showcase!
                        </p>
                        <div className="flex">
                            <button
                                className="px-3 py-2 text-base text-white bg-black rounded focus:shadow-outline hover:bg-gray-800 hidden md:block mr-3"
                                onClick={() => handleDeleteArtwork()}
                            >
                                Delete
                            </button>
                            <button
                                className={
                                    isButtonDisabled
                                        ? `px-3 py-2 text-base text-white bg-gray-300 rounded hidden md:block`
                                        : `px-3 py-2 text-base text-white bg-black rounded focus:shadow-outline hover:bg-gray-800 hidden md:block`
                                }
                                onClick={() => handleSelectArtwork(selectedImage)}
                                disabled={isButtonDisabled}
                            >
                                Select
                            </button>
                        </div>
                    </div>

                    <div
                        className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-3 mx-auto overflow-y-scroll gap-4 w-full h-4/5"
                    >
                        {filteredCurrentUserArtwork.map((artwork, i) =>
                            artwork.project_imageUrls.map((imageUrl, j) => (
                                <label className="w-64 h-64 rounded relative" key={j}>
                                    <input
                                        type="radio"
                                        name="image"
                                        value={imageUrl}
                                        checked={selectedImage === imageUrl}
                                        onChange={() => setSelectedImage(imageUrl)}
                                        className="hidden"
                                    />
                                    <Image
                                        src={imageUrl}
                                        alt="artwork Image"
                                        fill
                                        style={{ objectFit: "cover" }}
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className={`cursor-pointer ${selectedImage === imageUrl ? "ring-8 ring-blue-500" : ""
                                            }`}
                                    />
                                </label>
                            ))
                        )}
                    </div>
                    <div className="flex justify-center pt-4">
                        <button
                            className="px-3 py-2 text-base text-white bg-black rounded focus:shadow-outline hover:bg-gray-800 block md:hidden mr-3"
                            onClick={() => handleDeleteArtwork()}
                        >
                            Delete
                        </button>
                        <button
                            className={
                                isButtonDisabled
                                    ? `px-3 py-2 text-base text-white bg-gray-300 rounded block md:hidden`
                                    : `px-3 py-2 text-base text-white bg-black rounded focus:shadow-outline hover:bg-gray-800 block md:hidden`
                            }
                            onClick={() => handleSelectArtwork(selectedImage)}
                            disabled={isButtonDisabled}
                        >
                            Select
                        </button>

                    </div>
                    <BiX
                        className="absolute top-16 right-28 w-10 h-10 text-white cursor-pointer"
                        onClick={() => setOpenModalArt(false)}
                    />
                </motion.div>

            </motion.div>
        )
    );
}
