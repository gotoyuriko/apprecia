import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/firebase/auth/AuthContext';
import Navbar from '@/components/Nav/Navbar';
import Footer from '@/components/Footer';
import Project from '@/components/ArtworkProject/Project';

const NewProject = () => {
    const { currentUser } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!currentUser) {
            router.push('/');
        }
    }, [currentUser, router]);

    const projectStatus = 'new';

    return (
        <div className="w-full">
            <Navbar user={currentUser} />
            <Project user={currentUser} status={projectStatus} />
            <Footer />
        </div>
    );
}

export default NewProject;
