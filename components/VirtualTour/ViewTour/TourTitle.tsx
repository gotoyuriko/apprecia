import { BiSolidVolumeFull, BiSolidVolumeMute } from "react-icons/bi";
import type { ArtGallery } from "@/types";
import type { RefObject, Dispatch, SetStateAction } from "react";

interface TourTitleProps {
    tourData: ArtGallery;
    roomNo: number;
    muted: boolean;
    setMuted: Dispatch<SetStateAction<boolean>>;
    audioRef: RefObject<HTMLAudioElement>;
    setCurrentTime: Dispatch<SetStateAction<number>>;
    currentTime: number;
}

export default function TourTitle({ tourData, roomNo, muted, setMuted, audioRef, setCurrentTime, currentTime }: TourTitleProps) {
    const playAudio = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = currentTime;
            audioRef.current.volume = 0.3;
            audioRef.current.play();
        }
    };

    const pauseAudio = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleAudioButtonClick = () => {
        if (muted) {
            playAudio();
        } else {
            pauseAudio();
        }
        setMuted((prevState) => !prevState);
    };

    return (
        <div className="absolute top-10 right-5 z-10 flex flex-col items-end">
            <h1 className="md:text-2xl w-1/2 md:w-full text-justify font-bold text-white">
                <span>{tourData?.tour_name}</span> <br /> - Room <span>{roomNo}</span>
            </h1>
            {tourData?.tour_audio !== "" && (
                muted ? (
                    <BiSolidVolumeMute
                        onClick={handleAudioButtonClick}
                        className="w-10 h-10 text-white bg-black rounded-full p-2 shadow hover:bg-gray-800"
                    />
                ) : (
                    <BiSolidVolumeFull
                        onClick={handleAudioButtonClick}
                        className="w-10 h-10 text-white bg-black rounded-full p-2 shadow hover:bg-gray-800"
                    />
                )
            )}
            {tourData?.tour_audio !== "" && (
                <audio ref={audioRef} src={tourData?.tour_audio} loop></audio>
            )}
        </div>
    );
}
