import Navbar from '../components/Nav/Navbar';
import AppreciaView from '@/components/AppreciaView';
import ArtworkCard from '@/components/ArtWorkCard';
import SearchBar from '@/components/SearchBar';
import { useAuth } from '@/firebase/auth/AuthContext';

export default function Home() {
  const { currentUser } = useAuth();

  return (
    <div className="w-full">
      <Navbar user={currentUser} />
      <AppreciaView />
      <SearchBar />
      <ArtworkCard />
    </div>
  );
}
