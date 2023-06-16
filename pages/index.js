import ArtworkCard from '@/components/ArtworkCard';
import Navbar from '../components/Nav/Navbar';
import AppreciaView from '@/components/AppreciaView';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import { useAuth } from '@/firebase/auth/AuthContext';
import { useState, useEffect } from 'react';
import GetUserArtwork from '@/firebase/GetUserArtwork';

export default function Home() {
  const { currentUser } = useAuth();
  const [artworkData, setArtworkData] = useState(null);

  useEffect(() => {
    if (currentUser) {
      GetUserArtwork(currentUser.uid)
        .then((data) => {
          console.log("Fetched Artwork Data");
          setArtworkData(data);
        })
        .catch((error) => {
          console.log("Error getting user:", error);
        });
    }
  }, [currentUser]);

  return (
    <div className="w-full">
      <Navbar user={currentUser} />
      <AppreciaView />
      <SearchBar />
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-3 lg:py-8 lg:px-20">
            {
              artworkData && artworkData.map((item, index) => (
                <div key={index}>
                  <ArtworkCard
                    title={item.title}
                    description={item.description}
                    imageUrls={item.imageUrls}
                    uid={item.uid}
                  />
                </div>
              ))
            }
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
