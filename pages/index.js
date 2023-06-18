import ArtworkCard from '@/components/ArtworkCard';
import Navbar from '../components/Nav/Navbar';
import AppreciaView from '@/components/AppreciaView';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import { useAuth } from '@/firebase/auth/AuthContext';
import { useState, useEffect } from 'react';
import GetArtwork from '@/firebase/artworks/GetArtwork';

export default function Home() {
  const { currentUser } = useAuth();
  const [artworkData, setArtworkData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await GetArtwork();
        setArtworkData(data);
      } catch (error) {
        console.error("Error getting artwork:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full">
      <Navbar user={currentUser} />
      <AppreciaView />
      <SearchBar />

      <div className="flex justify-center mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {artworkData &&
            artworkData.map((item, index) => (
              <div key={index}>
                <ArtworkCard
                  title={item.project_title}
                  description={item.project_description}
                  imageUrls={item.project_imageUrls}
                  tags={item.project_tags}
                  link={item.project_link}
                  skills={item.project_skills}
                  uid={item.user_id}
                  createdAt={item.project_createdAt}
                  likesCount={item.project_likesCount ?? 0}
                  likedBy={item.project_likedBy ?? []}
                />
              </div>
            ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
