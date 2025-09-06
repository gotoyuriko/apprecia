import AppreciaView from "@/components/AppreciaView";
import ArtworkProject from "@/components/ArtworkProject/ArtworkProject";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const artworkdata = await GetArtworks();
      setArtworksData(artworkdata);
      const usersdata = await GetUsers();
      setUsersData(usersdata);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="w-full h-full">
      {
        loading ? (<Loader />) : (
          <>
            <Navbar currentUser={currentUser} />
            <AppreciaView />
            <SearchBar
              artworksData={artworksData}
              setFilteredData={setFilteredData}
              usersData={usersData}
            />
            <div className="min-h-[35vh] flex justify-center items-center px-4 sm:px-6 lg:px-8 py-8">
              {filteredData?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 w-full">
                  {filteredData.map((item, index) => (
                    <div key={index}>
                      <ArtworkProject
                        currentUser={currentUser}
                        artProjectItem={item}
                        usersData={usersData}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="font-bold">No artwork project is found.</p>
              )}
            </div>
            <Footer />
          </>
        )
      }
    </div>
  );
}
