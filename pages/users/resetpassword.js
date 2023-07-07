import Navbar from "@/components/Nav/Navbar";
import { useAuth } from "@/firebase/auth/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function ResetPassword() {
    const { resetPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [errormessage, setErrorMessage] = useState(null);
    const [successmessage, setSuccessmessage] = useState(null);
    const router = useRouter();

    const handleForm = async (event) => {
        event.preventDefault();

        const { error } = await resetPassword(email);

        if (error) {
            setErrorMessage(error);
            setSuccessmessage('');
        } else {
            setTimeout(() => {
                setErrorMessage('');
                setSuccessmessage('Please check your email to reset your password. Go Back to Log In...');
                router.push('/users/signin');
            }, 300);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-white">
            <Navbar />
            <div className="flex flex-grow">
                <div className="hidden lg:inline-block lg:relative lg:basis-2/4 lg:bg-[#d7dde6]">
                    <Image
                        src="/signin.png"
                        alt="Sign In Illustration"
                        className="object-contain"
                        fill
                        sizes="(max-width: 600px) 100vw, 50vw"
                        priority
                    />
                </div>
                <form onSubmit={handleForm} className="px-10 py-10 flex justify-center flex-col md:px-0 md:mx-auto w-full max-w-sm lg:basis-2/4">
                    <h1 className="text-2xl font-bold">Reset Email</h1>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        defaultValue={email}
                        placeholder='exmaple@mail.com'
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="block w-full rounded-md border-0 py-1.5 my-10 text-gray-900 
                                        shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-300 
                                        indent-2.5 sm:text-sm sm:leading-6"
                    />
                    <button
                        type="submit"
                        className="flex w-full justify-center rounded-md bg-black px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Password Reset Email Sent
                    </button>
                    <div>
                        {errormessage && <p className='pt-5 text-red-600 text-center'>{errormessage}</p>}
                    </div>
                    <div>
                        {successmessage && <p className='pt-5 text-green-600 text-center'>{successmessage}</p>}
                    </div>
                    <p className="mt-2 text-center text-sm text-gray-500">
                        <Link
                            passHref
                            href="/users/signin"
                            className="font-semibold leading-6 text-black hover:text-gray-600"
                        >
                            Go Back to Log In
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}