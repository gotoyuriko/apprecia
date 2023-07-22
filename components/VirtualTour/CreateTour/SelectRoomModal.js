import { audioList, roomImages } from "@/data/data";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";
import { GiSoundWaves } from "react-icons/gi";
import { MdAudiotrack } from "react-icons/md";

export default function SelectRoomModal({
    openModalEnv,
    setOpenModalEnv,
    setTourData,
    tourData,
    roomNo
}) {
    const [selectedImage, setSelectedImage] = useState(() => {
        const roomBackground = tourData?.tour_room[roomNo - 1]?.room_background;
        const matchingImage = roomImages.find(image => image.src === roomBackground);
        return matchingImage ? matchingImage.id : 1;
    });
    const [selectedAudio, setSelectedAudio] = useState(() => {
        const bgm = tourData?.tour_audio;
        const matchAudio = audioList.find(audio => audio.src === bgm);
        return matchAudio ? matchAudio.id : 1;
    });
    const audioRef = useRef(null);

    const handleOnCreateRoom = () => {
        const roomImage = roomImages.filter((room) => room.id === selectedImage);
        const galleryAudio = audioList.filter((audio) => audio.id === selectedAudio);
        setTourData({
            ...tourData,
            tour_room: tourData.tour_room.map((room, index) =>
                index === roomNo - 1 ? { ...room, room_background: roomImage[0]?.src } : room
            ),
            tour_audio: galleryAudio[0].src
        });

        if (audioRef.current) {
            audioRef.current.pause();
        }

        setOpenModalEnv(false);
    };

    const isButtonDisabled = selectedImage === "" || !tourData?.tour_name || selectedAudio === '';

    const handleAudioSelection = (audioId) => {
        if (audioId !== 1) {
            if (audioId === selectedAudio) {
                // Stop playback if the same audio is selected again
                audioRef.current.pause();
                setSelectedAudio("");
            } else {
                // Play selected audio and stop the previous audio if any
                if (audioRef.current) {
                    audioRef.current.pause();
                }
                setSelectedAudio(audioId);
                audioRef.current = new Audio(audioList.find((audio) => audio.id === audioId).src);
                audioRef.current.volume = 0.3;
                audioRef.current.play();
            }
        } else {
            if (audioRef.current) {
                audioRef.current.pause();
            }
            setSelectedAudio(audioId);
        }
    };

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
                    <div className="flex flex-col justify-start md:flex-row md:justify-between md:items-center">
                        <div className="flex-none flex flex-col items-start md:flex-row md:items-center">
                            <label
                                htmlFor="tour"
                                className="flex-none block text-base font-bold leading-6 text-gray-900 mr-1 md:mr-5"
                            >
                                Art Gallery Name
                            </label>
                            <input
                                onChange={(e) =>
                                    setTourData({ ...tourData, tour_name: e.target.value })
                                }
                                id="tour"
                                name="tour"
                                type="text"
                                autoComplete="tour"
                                value={tourData?.tour_name}
                                placeholder="Name Your Art Exhibition (Max 20 characters)"
                                required
                                maxLength="20"
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
                    <div className="flex flex-col lg:flex-row">
                        <div>
                            <h1 className="font-bold">Select Room</h1>
                            <div className="grid grid-cols-1 lg:grid-cols-2  gap-4 my-3">
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
                        <div className="mx-10">
                            <h1 className="font-bold">Select Audio</h1>
                            <div className="grid grid-cols-2 gap-4 my-1">
                                {audioList.map((audio) => (
                                    <label
                                        key={audio.id}
                                        className={`flex items-center relative cursor-pointer rounded py-2 pl-3 pr-1 ${selectedAudio === audio.id ? "bg-black ring-4 ring-blue-500 " : "bg-gray-200"}`}
                                    >
                                        <input
                                            type="radio"
                                            name="audio"
                                            value={audio.id}
                                            checked={selectedAudio === audio.id}
                                            onChange={() => handleAudioSelection(audio.id)}
                                            className="hidden"
                                        />
                                        <span className={`${selectedAudio === audio.id ? 'text-white' : 'text-black'}`}>{audio.title}</span>
                                        {
                                            audio.id === 1 ? null :
                                                audio.id > 1 && selectedAudio === audio.id ? <GiSoundWaves className='w-5 h-5 ml-1 text-white' /> :
                                                    <MdAudiotrack className='w-5 h-5 ml-1 text-black' />
                                        }
                                    </label>
                                ))}
                            </div>
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
