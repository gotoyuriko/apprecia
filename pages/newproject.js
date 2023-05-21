import Footer from '@/components/Footer';
import Navbar from '../components/Nav/Navbar';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
export default function NewProject() {
    const { user } = useAuth;
    const router = useRouter();

    useEffect(() => {
        if (user == null) router.push("/")
    }, [router, user]);

    return (
        <div className="w-full">
            <Navbar user={currentUser} />
            <Footer />
        </div>
    );
}
