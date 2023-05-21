import { FcGoogle } from "react-icons/fc";
import { useAuthState } from "react-firebase-hooks/auth";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/firebase/FirebaseConfig";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function GoogleAuthBtn({ formStatus }) {
    //Check if Google Authentication is Sign Up or Sign In
    const [status, setStatus] = useState(formStatus === 'signup');
    //Check if user information is null or not
    const [user, setuser] = useAuthState(auth);

    // Asynchronous sign in with pop up
    const googleAuth = new GoogleAuthProvider();
    const googleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleAuth);
        } catch (error) {
            if (error.code === "auth/cancelled-popup-request") {
                console.log("Google sign-in popup was cancelled by the user.");
            } else if (e.code === "auth/account-exists-with-different-credential") {
                error = "An account with the same email address already exists.";
            } else {
                console.log("An error occurred during Google sign-in:", error);
            }
        }
    }

    // control router
    const router = useRouter();

    useEffect(() => {
        if (user != null) {
            console.log('Welcome to Apprecia !');
            console.log('Hi, ' + user.displayName);
            router.push("/");
        }
    }, [router, user]);

    return (
        <>
            <button onClick={googleLogin}
                className="mt-4 h-10 pr-4 cusrosr-pointer bg-[#4285F4] flex flex-row items-center rounded-sm">
                <div className="bg-white w-9 h-9 ml-0.5 mr-6 rounded-l-sm flex justify-center items-center">
                    <FcGoogle className="w-5 h-5" />
                </div>
                <p className="font-roboto text-base text-white">
                    {status ? "Sign up with Google" : "Sign in with Google"}
                </p>
            </button>
        </>
    );
}