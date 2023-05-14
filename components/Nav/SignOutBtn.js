import { signOut } from 'firebase/auth';
import { auth } from '@/firebase/config';
import { useRouter } from 'next/router';

export default function SignOutBtn({ setIsOpen }) {
    const router = useRouter();
    //Handle Logout
    const handleLogout = async () => {
        try {
            await signOut(auth);
            setIsOpen(false);
            router.push("/");
        } catch (error) {
            // Handle any errors that occur during logout
            console.error("Error logging out:", error);
        }
    };
    return (
        <button onClick={handleLogout} className='text-lg p-3 bg-black font-bold text-white rounded-lg md:hidden'> Sign Out </button>
    );
}