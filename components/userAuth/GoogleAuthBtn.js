import { FcGoogle } from "react-icons/fc";
import { useAuthState } from "react-firebase-hooks/auth";
import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { auth } from "../firebase/FirebaseConfig";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function GoogleAuthBtn({ formStatus }) {
    //Check if Google Authentication is Sign Up or Sign In
    const [status, setStatus] = useState(formStatus === 'signup');
    //Check if user information is null or not
    const [user, setuser] = useAuthState(AuthenticatorAssertionResponse);

    // control router
    const router = useRouter();

    // Asynchronous sign in with pop up
    const googleAuth = new GoogleAuthProvider();
    const googleLogin = async () => {
        const { result, error } = await googleAuthentication();
        if (error) {
            setErrorMessage(error);
        } else {
            console.log('Good Bye !');
            router.push('/');
        }
    }

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