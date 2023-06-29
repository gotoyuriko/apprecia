import { useRouter } from "next/router";
import { useState } from "react";

export default function HomeButton() {
    const router = useRouter();

    const [exitMsg, setExitMsg] = useState("");
    const [visible, setVisible] = useState(false);

    const handleGoBack = () => {
        setVisible(true);
        setExitMsg("Redirecting...")
        router.back();
    }

    return (
        <div className="absolute z-10 bottom-5 right-5">
            <button className="bg-white text-black font-bold py-2 px-4 rounded hover:bg-gray-700 hover:text-white"
                onClick={handleGoBack}>
                Exit
            </button>
            <p className={`text-white mt-3 ${visible ? "block" : "hidden"}`}>{exitMsg}</p>
        </div>
    )
}