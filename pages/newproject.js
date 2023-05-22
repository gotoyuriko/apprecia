import Navbar from '../components/Nav/Navbar';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '@/firebase/auth/AuthContext';

export default function NewProject() {
    const { currentUser } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (currentUser == null) router.push("/")
    }, [router, currentUser]);

    return (
        <div className="w-full">
            <Navbar user={currentUser} />
            <div className="flex flex-col items-center justify-center w-full h-screen">
                <h1 className="text-4xl font-bold">Create New Project</h1>
                <div className="flex flex-col items-center justify-center w-full h-full">
                    <div>
                        <h1 className="text-2xl font-bold">Project Name</h1>
                        <input className="w-96 h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Project Description</h1>
                        <textarea className="w-96 h-40 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Project Tags</h1>
                        <input className="w-96 h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Project Image</h1>
                        <input className="w-96 h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Project Link</h1>
                        <input className="w-96 h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Project Repo</h1>
                        <input className="w-96 h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Project Status</h1>
                        <input className="w-96 h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Project Type</h1>
                        <input className="w-96 h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Project Category</h1>
                        <input className="w-96 h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Project Language</h1>
                        <input className="w-96 h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Project Frameworks</h1>
                        <input className="w-96 h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline" />
                    </div>
                    <div>
                        {/* <h1 className="text-2xl font-bold">Project Contributors</h1> */}
                        <button className="w-96 h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline">Add Contributors</button>
                    </div>
                    <div>
                        <button className="w-96 h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline">Create Project</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
