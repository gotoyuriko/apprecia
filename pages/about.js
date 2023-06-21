import AboutView from "../components/About/AboutView";
import Navbar from "../components/Nav/Navbar";
import { useAuth } from '../firebase/auth/AuthContext';

export default function About() {
    const { currentUser } = useAuth();
    return (
        <div className="w-full h-screen">
            <Navbar user={currentUser} />
            <AboutView />
        </div>
    );
}
