import AppreciaView from "@/components/AppreciaView";
import ArtworkCard from "@/components/ArtworkProject/ArtworkCard";
import Footer from "@/components/Footer";
import Navbar from "@/components/Nav/Navbar";
import SearchBar from "@/components/SearchBar";
import GetArtwork from "@/firebase/artworks/GetArtwork";
import { useAuth } from "@/firebase/auth/AuthContext";
import GetUsers from "@/firebase/users/GetUsers";
import { useEffect, useState } from "react";

export default function Home() {
  const { currentUser } = useAuth();
  const [artworksData, setArtworksData] = useState([]);
  const [filteredData, setFilteredData] = useState(artworksData);
  const [usersData, setUsersData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const artworkdata = await GetArtwork();
      setArtworksData(artworkdata);
      const usersdata = await GetUsers();
      setUsersData(usersdata);
    };
    fetchData();
  }, []);

  return (
    <div className="w-full">
      <Navbar currentUser={currentUser} />
      <AppreciaView />
      <SearchBar artworksData={artworksData} setFilteredData={setFilteredData} usersData={usersData} />
      <div className="min-h-[35vh] flex justify-center items-center mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredData?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredData.map((item, index) => (
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
        ) : (
          <p className="font-bold">No artwork project is found.</p>
        )}
      </div>
      <Footer />
    </div>
  );
}
