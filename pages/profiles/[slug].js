import Footer from "@/components/Footer";
import Navbar from "@/components/Nav/Navbar";
import ArtworkSection from "@/components/Profile/ArtworkSection";
import ProfileSection from "@/components/Profile/ProfileSection";
import GetDoc from "@/firebase/GetDoc";
import GetArtworks from "@/firebase/artworks/GetArtworks";
import { useAuth } from "@/firebase/auth/AuthContext";
import GetArtGalleries from "@/firebase/tours/GetArtGalleries";
import GetUsers from "@/firebase/users/GetUsers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Profile() {
  const router = useRouter();
  const { slug } = router.query;

  const { currentUser } = useAuth();
  const [currentUserData, setUserData] = useState(null);
  const [usersData, setUsersData] = useState(null);
  const [artworkData, setArtworkData] = useState(null);
  const [galleryData, setGalleryData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const userdata = await GetDoc("users", slug);
      setUserData(userdata);
    };

    if (slug) {
      fetchData();
    }
  }, [slug]);

  useEffect(() => {
    const fetchData = async () => {
      const artworksdata = await GetArtworks();
      setArtworkData(artworksdata);
      const usersdata = await GetUsers();
      setUsersData(usersdata);
      const artgalleriesdata = await GetArtGalleries();
      setGalleryData(artgalleriesdata);
    };
    fetchData();
  }, [])

  return (
    <div className="w-full">
      <Navbar currentUser={currentUser} />
      <div className="container mx-auto py-8">
        {/* Profile */}
        <ProfileSection
          currentUserData={currentUserData}
          setUserData={setUserData}
          slug={slug}
        />
        <ArtworkSection
          currentUserData={currentUserData}
          artworkData={artworkData}
          usersData={usersData}
          currentUser={currentUser}
          galleryData={galleryData}
          slug={slug}
        />
      </div>
      <Footer />
    </div>
  );
}