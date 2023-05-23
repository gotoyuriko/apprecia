import Navbar from '../components/Nav/Navbar';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '@/firebase/auth/AuthContext';
import ImageUploader from '@/components/ImageUploader';

export default function NewProject() {
    const { currentUser } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (currentUser == null) router.push("/")
    }, [router, currentUser]);

    return (
        <div className="w-full">
            <Navbar user={currentUser} />
            <h1 className="text-4xl font-bold">Create New Project</h1>
            <div className="flex flex-row h-screen">
                <div className='flex-1'>
                    <ImageUploader />
                </div>
                <div className="flex-1 flex flex-col items-center justify-center w-full h-full">
                    <div>
                        <h1 className="text-2xl font-bold">Project Title</h1>
                        <input className="w-96 h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Description</h1>
                        <textarea className="w-96 h-40 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Tags</h1>
                        <input className="w-96 h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline" />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold">Link (Optional)</h1>
                        <input className="w-96 h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Skill</h1>
                        <input className="w-96 h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline" />
                    </div>
                    <div>
                        <button className="w-96 h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline">Create Project</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
