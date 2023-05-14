'use client'
import { useState } from "react";
import signUp from "@/firebase/auth/signup";
import { useRouter } from "next/navigation";

export default function SignUpForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullname, setFullname] = useState('');
    const router = useRouter();

    const handleForm = async (event) => {
        event.preventDefault();
        const { result, error } = await signUp(fullname, email, password);

        if (error) {
            return console.log(error);
        }

        // else successful
        console.log(result);
        return router.push("/");
    }
    return (
        <>
            <form className="space-y-6 mt-3" action="#" method="POST">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                        Name
                    </label>
                    <div className="mt-2">
                        <input
                            onChange={(e) => setFullname(e.target.value)}
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            required
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 
                                        shadow-sm ring-1 ring-offset-transparent ring-inset ring-gray-300 
                                        indent-2.5 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                        Email address
                    </label>
                    <div className="mt-2">
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 
                                        shadow-sm ring-1 ring-offset-transparent ring-inset ring-gray-300 
                                        indent-2.5 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between">
                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                            Password
                        </label>
                    </div>
                    <div className="mt-2">
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 
                                        shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-300 
                                        indent-2.5 sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        className="flex w-full justify-center rounded-md bg-black px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Create Account
                    </button>
                </div>
            </form>
        </>
    );
}