import Navbar from '../components/Nav/Navbar';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '@/firebase/auth/AuthContext';
import ImageUploader from '@/components/ImageUploader';
import Footer from '@/components/Footer';

export default function NewProject() {
    const { currentUser } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!currentUser) {
            router.push('/');
        }
    }, [currentUser, router]);

    return (
        <div className="w-full">
            <Navbar user={currentUser} />
            <div className="h-full py-5">
                <h1 className="text-4xl font-bold text-center lg:text-start py-5 px-10">
                    Create New Project
                </h1>
                <div className="flex flex-col md:flex-row">
                    <div className="flex-1 px-5 pb-5 lg:p-10">
                        <ImageUploader />
                    </div>
                    <div className="flex-1 flex flex-col items-center w-full h-full">
                        <div className="mb-4">
                            <h1 className="text-xl font-medium">Project Title</h1>
                            <input
                                className="w-96 h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline"
                                type="text"
                            />
                        </div>
                        <div className="mb-4">
                            <h1 className="text-xl font-medium">Description</h1>
                            <textarea
                                className="w-96 h-40 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline"
                                rows="4"
                            ></textarea>
                        </div>
                        <div className="mb-4">
                            <h1 className="text-xl font-medium">Tags</h1>
                            <input
                                className="w-96 h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline"
                                type="text"
                            />
                        </div>
                        <div className="mb-4">
                            <h1 className="text-xl font-medium">Skill</h1>
                            <input
                                className="w-96 h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline"
                                type="text"
                            />
                        </div>
                        <div className="mb-6">
                            <h1 className="text-xl font-medium">Link</h1>
                            <input
                                className="w-96 h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline"
                                type="text"
                            />
                        </div>
                        <div className="mb-4">
                            <button className="w-96 h-10 px-3 text-base text-white bg-black border rounded-lg focus:shadow-outline">
                                Create Project
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
