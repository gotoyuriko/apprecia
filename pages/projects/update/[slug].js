import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/firebase/auth/AuthContext';
import Navbar from '@/components/Nav/Navbar';
import Footer from '@/components/Footer';
import Project from '@/components/ArtworkProject/Project';

const UpdateProject = () => {
    const { currentUser } = useAuth();
    const router = useRouter();
    const { slug } = router.query;

    useEffect(() => {
        if (!currentUser) {
            router.push('/');
        }
    }, [currentUser, router]);

    const projectStatus = 'update';

    return (
        <div className="w-full">
            <Navbar user={currentUser} />
            <Project user={currentUser} status={projectStatus} slug={slug} />
            <Footer />
        </div>
    );
}

export default UpdateProject;
