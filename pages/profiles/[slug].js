import ArtworkCard from "@/components/ArtworkCard";
import Footer from "@/components/Footer";
import Navbar from "@/components/Nav/Navbar";
import GetArtwork from "@/firebase/artworks/GetArtwork";
import GetUser from "@/firebase/users/GetUser";
import { useAuth } from "@/firebase/auth/AuthContext";;
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ProfileSection from "@/components/ProfileSection";

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
        <ProfileSection userData={userData} setUserData={setUserData} />

        {artworkData?.filter((artwork) => artwork.user_id === userData?.user_id)
          .length === 0 ? (
          <div className="h-[70vh] w-full flex justify-center items-center">
            {currentUser ? (
              <div className="flex flex-col">
                <p className="font-bold text-lg text-center">
                  Your project showcase is empty. <br />
                  Start uploading your projects now!
                </p>
                <button
                  onClick={() => router.push("/newproject")}
                  className="mt-3 p-3 bg-black hover:bg-gray-600 font-bold text-white rounded inline-block"
                >
                  Create Project
                </button>
              </div>
            ) : (
              <p className="font-bold text-lg">
                This user has no projects yet.
              </p>
            )}
          </div>
        ) : (
          <div className="min-h-[70vh] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-3 lg:py-8 lg:px-20 my-10">
            {artworkData
              ?.filter((artwork) => artwork.user_id === userData?.user_id)
              .map((filteredArtwork, index) => (
                <div key={index}>
                  <ArtworkCard
                    title={filteredArtwork.project_title}
                    imageUrls={filteredArtwork.project_imageUrls}
                    uid={filteredArtwork.user_id}
                    description={filteredArtwork.project_description}
                    tags={filteredArtwork.project_tags}
                    link={filteredArtwork.project_link}
                    skills={filteredArtwork.project_skills}
                    createdAt={filteredArtwork.project_createdAt}
                    likesCount={filteredArtwork.project_likesCount ?? 0}
                    likedBy={filteredArtwork.project_likedBy ?? []}
                    viewsCount={filteredArtwork.project_viewsCount ?? 0}
                  />
                </div>
              ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
