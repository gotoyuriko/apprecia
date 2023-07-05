import AppreciaView from "@/components/AppreciaView";
import ArtworkCard from "@/components/ArtworkProject/ArtworkCard";
import Footer from "@/components/Footer";
import Loading from "@/components/Loading";
import Navbar from "@/components/Nav/Navbar";
import SearchBar from "@/components/SearchBar";
import GetArtwork from "@/firebase/artworks/GetArtwork";
import { useAuth } from "@/firebase/auth/AuthContext";
import { useEffect, useState } from "react";

export default function Home() {
  const { currentUser } = useAuth();
  const [artworkData, setArtworkData] = useState([]);
  const [filteredData, setFilteredData] = useState(artworkData);

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const artworkdata = await GetArtwork();
      setArtworkData(artworkdata);
    };
    fetchData();
  }, []);

  if (isLoaded) {
    return (
      <div className="w-full">
        <Navbar currentUser={currentUser} />
        <AppreciaView />

        <SearchBar artworkData={artworkData} setFilteredData={setFilteredData} />

        <div className="flex justify-center mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredData &&
              filteredData.map((item, index) => (
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
                    viewsCount={item.project_viewsCount ?? 0}
                  />
                </div>
              ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  } else {
    return (
      <div className="w-full">
        <Loading />
      </div>
    )
  }
}
