import ArtworkCard from '@/components/ArtworkCard';
import Navbar from '../components/Nav/Navbar';
import AppreciaView from '@/components/AppreciaView';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import { useAuth } from '@/firebase/auth/AuthContext';
import { useState, useEffect } from 'react';
import GetArtwork from '@/firebase/GetArtwork';
import BasicModal from '@/components/Modal';

export default function Home() {
  const { currentUser } = useAuth();
  const [artworkData, setArtworkData] = useState(null);

  useEffect(() => {
    GetArtwork()
      .then((data) => {
        setArtworkData(data);
      })
      .catch((error) => {
        console.error("Error getting artwork:", error);
      });
  }, []);

  return (
    <div className="w-full">
      <Navbar user={currentUser} />
      <AppreciaView />
      <SearchBar />
      <BasicModal />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {artworkData &&
            artworkData.map((item, index) => (
              <div key={index}>
                <ArtworkCard
                  title={item.project_title}
                  imageUrls={item.project_imageUrls}
                  uid={item.user_id}
                />
              </div>
            ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
