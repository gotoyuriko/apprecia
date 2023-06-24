import Footer from "@/components/Footer";
import Navbar from "@/components/Nav/Navbar";
import GetArtwork from "@/firebase/artworks/GetArtwork";
import GetUser from "@/firebase/users/GetUser";
import { useAuth } from "@/firebase/auth/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ProfileSection from "@/components/Profile/ProfileSection";
import ArtworkSection from "@/components/Profile/ArtworkSection";

export default function Profile() {
  const router = useRouter();
  const { slug } = router.query;

  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [artworkData, setArtworkData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await GetUser(slug);
        setUserData(userData);
      } catch (error) {
        console.error("Error getting user:", error);
      }

      try {
        const artworkData = await GetArtwork();
        setArtworkData(artworkData);
      } catch (error) {
        console.error("Error getting artwork:", error);
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
        <ArtworkSection artworkData={artworkData} userData={userData} currentUser={currentUser} />
      </div>
      <Footer />
    </div>
  );
}
