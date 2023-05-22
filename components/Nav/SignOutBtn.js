import { useAuth } from '@/firebase/auth/AuthContext';
import { useRouter } from 'next/router';

export default function SignOutBtn() {
    const { signout } = useAuth();
    const router = useRouter();
    //Handle Logout
    const handleLogout = async () => {
        try {
            await signout();
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