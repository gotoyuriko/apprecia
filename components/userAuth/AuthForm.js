'use client';

import { useState } from 'react';
import signUp from '@/firebase/auth/signup';
import signIn from '@/firebase/auth/signin';
import { useRouter } from 'next/navigation';

export default function AuthForm({ formStatus }) {
    const [userAuth, setUserAuth] = useState(formStatus === 'signup');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullname: '',
    });
    const router = useRouter();
    const [errormessage, setErrorMessage] = useState(null);

    const handleForm = async (event) => {
        event.preventDefault();
        const { fullname, email, password } = formData;

        const { result, error } = userAuth
            ? await signUp(fullname, email, password)
            : await signIn(email, password);

        if (error) {
            setErrorMessage("An error occurred, please check your input.");
        } else {
            console.log('Welcome to Apprecia !');
            console.log('Hi, ' + fullname);
            router.push('/');
        }
    };

    return (
        <form onSubmit={handleForm} className="space-y-6 mt-3">
            {userAuth ? (
                <div>
                    <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                        Your
                    </label>
                    <div className="mt-2">
                        <input
                            onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            placeholder="Full Name"
                            required
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 placeholder:text-gray-300
                                        shadow-sm ring-1 ring-offset-transparent ring-inset ring-gray-300 
                                        indent-2.5 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>
            ) : null}
            <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                    Email address
                </label>
                <div className="mt-2">
                    <input
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        defaultValue={formData.email}
                        placeholder='exmaple@mail.com'
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 placeholder:text-gray-300
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
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        defaultValue={formData.password}
                        id="password"
                        name="password"
                        type="password"
                        placeholder="+8 characters"
                        minLength={8}
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
                    {userAuth ? 'Create Account' : 'Sign in'}
                </button>
                <div>
                    {errormessage && <p className='pt-5 text-red-600 text-center'>{errormessage}</p>}
                </div>
            </div>
        </form>
    );
}
