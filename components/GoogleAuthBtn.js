import { FcGoogle } from "react-icons/fc";
import { useAuthState } from "react-firebase-hooks/auth";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/firebase/config";
import { useEffect } from "react";

export default function GoogleAuthBtn() {
    const [user, setuser] = useAuthState(auth);
    const googleAuth = new GoogleAuthProvider();
    const googleLogin = async () => {
        const result = await signInWithPopup(auth, googleAuth);
    }

    useEffect(() => {
        console.log(user);
    }, [user]);

    return (
        <>
            <button onClick={googleLogin}
                className="mt-4 h-10 pr-4 cusrosr-pointer bg-[#4285F4] flex flex-row items-center rounded-sm">
                <div className="bg-white w-9 h-9 ml-0.5 mr-6 rounded-l-sm flex justify-center items-center">
                    <FcGoogle className="w-5 h-5" />
                </div>
                <p className="font-roboto text-base text-white">Sign in with Google</p>
            </button>
        </>
    );
}