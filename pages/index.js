import AppreciaView from "@/components/AppreciaView";
import ArtworkProject from "@/components/ArtworkProject/ArtworkProject";
import Footer from "@/components/Footer";
import Navbar from "@/components/Nav/Navbar";
import SearchBar from "@/components/SearchBar";
import GetArtworks from "@/firebase/artworks/GetArtworks";
import { useAuth } from "@/firebase/auth/AuthContext";
import GetUsers from "@/firebase/users/GetUsers";
import { useEffect, useState } from "react";

export default function Home() {
  const { currentUser } = useAuth();
  const [artworksData, setArtworksData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [filteredData, setFilteredData] = useState(artworksData);

  useEffect(() => {
    const fetchData = async () => {
      const artworkdata = await GetArtworks();
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
      <SearchBar
        artworksData={artworksData}
        setFilteredData={setFilteredData}
        usersData={usersData}
      />
      <div className="min-h-[35vh] flex justify-center items-center mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredData?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredData.map((item, index) => (
              <div key={index}>
                <ArtworkProject
                  currentUser={currentUser}
                  artProjectItem={item} // 1 art project
                  usersData={usersData} // all users
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
