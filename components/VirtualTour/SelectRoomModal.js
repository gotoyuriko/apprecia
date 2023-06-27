import { roomImages } from "@/data/data";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

export default function SelectRoomModal({ setSelectRoom, openModalEnv, setOpenModalEnv, setRoomData, roomData }) {
    const [selectedImage, setSelectedImage] = useState(null);

    const handleOnCreateRoom = () => {
        const roomImage = roomImages.filter((room) => room.id === selectedImage);
        setSelectRoom(roomImage[0].src);
        setOpenModalEnv(false);
    };

    const isButtonDisabled = roomData.roomImage === '' || roomData.tourName === '';

    return (
        openModalEnv && (
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
                    className="bg-white w-full lg:w-5/6 h-full lg:h-5/6 rounded-lg p-6 overflow-y-scroll md:overflow-y-hidden"
                >
                    <div className="flex justify-between items-center">
                        <div className="flex-none flex flex-row items-center">
                            <label
                                htmlFor="tour"
                                className="flex-none block text-base font-bold leading-6 text-gray-900 mr-1 md:mr-5"
                            >
                                Tour Name
                            </label>
                            <input
                                onChange={(e) =>
                                    setRoomData({ ...roomData, tourName: e.target.value })
                                }
                                id="tour"
                                name="tour"
                                type="text"
                                autoComplete="tour"
                                value={roomData.tourName}
                                placeholder="Name Your Art Exhibition"
                                required
                                className="flex-none block w-full rounded-md border-0 py-1.5 text-gray-900 placeholder:text-gray-300
                                        shadow-sm ring-1 ring-offset-transparent ring-inset ring-gray-300 
                                        indent-2.5 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                            />
                        </div>
                        <button
                            className={
                                isButtonDisabled
                                    ? `px-3 py-2 text-base text-white bg-gray-300 rounded hidden md:block`
                                    : `px-3 py-2 text-base text-white bg-black rounded focus:shadow-outline hover:bg-gray-800 hidden md:block`
                            }
                            onClick={handleOnCreateRoom}
                            disabled={isButtonDisabled}
                        >
                            Create Room
                        </button>
                    </div>
                    <hr className="my-4" />
                    <div>
                        <h1 className="font-bold">Select Your Room</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-4 my-3">
                            {roomImages.map((image) => (
                                <label
                                    key={image.id}
                                    className="flex items-center w-64 h-32 md:w-96 md:h-48 relative left-0 right-0 m-auto"
                                >
                                    <input
                                        type="radio"
                                        name="image"
                                        value={image.id}
                                        checked={selectedImage === image.id}
                                        onChange={() => setSelectedImage(image.id)}
                                        className="hidden"
                                    />
                                    <Image
                                        fill
                                        onClick={() =>
                                            setRoomData({ ...roomData, roomImage: image.src })
                                        }
                                        src={image.src}
                                        alt={image.alt}
                                        priority
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className={`cursor-pointer ${selectedImage === image.id ? "ring-4 ring-blue-500" : ""}`}
                                    />
                                </label>
                            ))}
                        </div>
                    </div>

                    <button
                        className={
                            isButtonDisabled
                                ? `relative right-0 left-0 mx-auto mt-10 px-3 py-2 text-base text-white bg-gray-300 rounded block md:hidden`
                                : `relative right-0 left-0 mx-auto mt-10 px-3 py-2 text-base text-white bg-black rounded focus:shadow-outline hover:bg-gray-800 block md:hidden`
                        }
                        onClick={handleOnCreateRoom}
                        disabled={isButtonDisabled}
                    >
                        Create Room
                    </button>
                </motion.div>
            </motion.div>
        )
    );
}
