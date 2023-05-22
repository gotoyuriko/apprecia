import { auth } from '@/firebase/FirebaseConfig';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/router';

export default function SignOutBtn() {
    const router = useRouter();
    //Handle Logout
    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push("/");
        } catch (error) {
            // Handle any errors that occur during logout
            console.error("Error logging out:", error);
        }
    };
    return (
        <button onClick={handleLogout}> Sign Out </button>
    );
}