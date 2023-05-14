import AuthForm from "@/components/userAuth/AuthForm";
import GoogleAuthBtn from "@/components/userAuth/GoogleAuthBtn";
import Navbar from "@/components/Nav/Navbar";
import Link from "next/link";


export default function SignIn() {

    return (
        <div className="w-full h-screen bg-white">
            <Navbar />
            <div className="p-8 md:px-0 md:py-12 mx-auto w-full max-w-sm">
                <h1 className="text-2xl font-bold">Sign in to Apprecia</h1>

                <GoogleAuthBtn />

                <hr className="mt-8 border-top border-solid border-gray-400 h-4 text-center overflow-visible
                                after:content-['Or'] after:bg-white after:text-gray-400 after:inline-block after:h-8 after:leading-8 after:relative after:-top-4 after:px-4" />


                <AuthForm formStatus='signin' />


                <p className="mt-10 text-center text-sm text-gray-500">
                    Not a member?{' '}
                    <Link href="/users/signup" className="font-semibold leading-6 text-black hover:text-gray-600">
                        Sign Up Now
                    </Link>
                </p>
            </div>
        </div>
    )
}