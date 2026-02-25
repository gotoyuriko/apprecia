import { useRouter } from "next/router";
import { useState } from "react";
import type { RefObject, Dispatch, SetStateAction } from "react";

interface HomeButtonProps {
    setMuted: Dispatch<SetStateAction<boolean>>;
    muted: boolean;
    audioRef: RefObject<HTMLAudioElement>;
}

export default function HomeButton({ setMuted, muted, audioRef }: HomeButtonProps) {
    const router = useRouter();

    const [exitMsg, setExitMsg] = useState("");
    const [visible, setVisible] = useState(false);

    const handleGoBack = () => {
        if (audioRef && !muted && audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setMuted(false);
        }
        setVisible(true);
        setExitMsg("Redirecting...");
        router.back();
    };

    return (
        <div className="absolute z-10 bottom-5 right-5">
            <button className="bg-white text-black font-bold py-2 px-4 rounded hover:bg-gray-700 hover:text-white"
                onClick={handleGoBack}>
                Exit
            </button>
            <p className={`text-white mt-3 ${visible ? "block" : "hidden"}`}>{exitMsg}</p>
        </div>
    );
}
