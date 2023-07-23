import Navbar from "@/components/Nav/Navbar";
import AuthForm from "@/components/userAuth/AuthForm";
import Link from "next/link";
import GoogleAuthBtn from "@/components/userAuth/GoogleAuthBtn";
import Image from "next/image";


export default function SignUp() {
    return (
        <div className="flex flex-col h-screen bg-white">
            <Navbar />
            <div className="flex flex-grow">
                <div className="hidden lg:inline-block lg:relative lg:basis-2/4 lg:bg-[#e2e0e0]">
                    <Image
                        src="/signup.png"
                        alt="Sign In Illustration"
                        className="object-contain"
                        fill
                        sizes="(max-width: 600px) 100vw, 50vw"
                        priority
                    />
                </div>
                <div className="p-8 md:px-0 md:py-12 mx-auto w-full max-w-sm h-full">
                    <h1 className="text-2xl font-bold">Sign up to Apprecia</h1>

                    <GoogleAuthBtn formStatus='signup' />

                    <hr className="mt-8 border-top border-solid border-gray-400 h-4 text-center overflow-visible
                                after:content-['Or'] after:bg-white after:text-gray-400 after:inline-block after:h-8 after:leading-8 after:relative after:-top-4 after:px-4" />

                    <AuthForm formStatus='signup' />

                    <p className="mt-10 text-center text-sm text-gray-500">
                        Already a member?{' '}
                        <Link passHref href="/users/signin" className="font-semibold leading-6 text-black hover:text-gray-600">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}