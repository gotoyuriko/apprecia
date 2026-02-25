import { useAuth } from "@/firebase/auth/AuthContext";
import AddUser from "@/firebase/users/AddUser";
import type { User, UserCredential } from "firebase/auth";
import { useRouter } from "next/router";
import { FcGoogle } from "react-icons/fc";

interface GoogleAuthBtnProps {
    formStatus?: string;
}

export default function GoogleAuthBtn({ formStatus }: GoogleAuthBtnProps) {
    const { googleAuthentication } = useAuth();
    const router = useRouter();

    const googleLogin = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const { result, error } = await googleAuthentication();
        if (error) {
            console.error("An error occurred during Google sign-in:", error);
        } else if (result) {
            await AddUser((result as UserCredential).user);
            router.push('/');
        }
    };

    return (
        <button onClick={googleLogin} className="mt-4 h-10 pr-4 cusrosr-pointer bg-[#4285F4] flex flex-row items-center rounded-sm">
            <div className="bg-white w-9 h-9 ml-0.5 mr-6 rounded-l-sm flex justify-center items-center">
                <FcGoogle className="w-5 h-5" />
            </div>
            <p className="font-roboto text-base text-white">
                {formStatus === 'signup' ? "Sign up with Google" : "Sign in with Google"}
            </p>
        </button>
    );
}
