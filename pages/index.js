import ArtworkCard from '@/components/ArtworkCard';
import Navbar from '../components/Nav/Navbar';
import AppreciaView from '@/components/AppreciaView';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import { useAuth } from '@/firebase/auth/AuthContext';

export default function Home() {
  const { currentUser } = useAuth();

  return (
    <div className="w-full">
      <Navbar user={currentUser} />
      <AppreciaView />
      <SearchBar />
      <div className="flex justify-center">
        <ArtworkCard />
      </div>
      <Footer />
    </div>
  );
}
