import Footer from "@/components/Footer";
import Navbar from "@/components/Nav/Navbar";
import GetArtwork from "@/firebase/artworks/GetArtwork";
import GetUser from "@/firebase/users/GetUser";
import { useAuth } from "@/firebase/auth/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ProfileSection from "@/components/Profile/ProfileSection";
import ArtworkSection from "@/components/Profile/ArtworkSection";
import GetTour from "@/firebase/tours/GetTour";

export default function Profile() {
  const router = useRouter();
  const { slug } = router.query;

  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [artworkData, setArtworkData] = useState(null);
  const [galleryData, setGalleryData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await GetUser(slug);
        setUserData(data);
      } catch (error) {
        console.error("Error getting user:", error);
      }

      try {
        const data = await GetArtwork();
        setArtworkData(data);
      } catch (error) {
        console.error("Error getting artwork:", error);
      }

      try {
        const data = await GetTour();
        setGalleryData(data);
      } catch (error) {
        console.error("Error getting art gallery:", error);
      }
    };

    if (slug) {
      fetchData();
    }
  }, [slug]);

  return (
    <div className="w-full">
      <Navbar user={currentUser} />
      <div className="container mx-auto py-8">
        {/* Profile */}
        <ProfileSection userData={userData} setUserData={setUserData} slug={slug} />
        <ArtworkSection
          artworkData={artworkData}
          userData={userData}
          currentUser={currentUser}
          galleryData={galleryData} />
      </div>
      <Footer />
    </div>
  );
}
