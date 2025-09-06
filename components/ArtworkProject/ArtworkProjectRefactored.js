import { useAnimation } from "framer-motion";
import { useState } from "react";
import { useArtworkWithUser } from "@/firebase/hooks/useArtworkWithUser";
import { useArtworkInteractions } from "@/firebase/hooks/useArtworkInteractions";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";

export default function ArtworkProject({ currentUser, artProjectItem, usersData }) {
    const [open, setOpen] = useState(false);
    
    // Use custom hooks for data and interactions
    const { creatorData, creatorDocId } = useArtworkWithUser(artProjectItem?.id);
    const { 
        isLiked, 
        likesCount, 
        viewsCount, 
        handleLikeToggle, 
        handleViewUpdate,
        loadComments 
    } = useArtworkInteractions(artProjectItem, currentUser);

    const controls = useAnimation();

    // Open Modal
    const handleIsModal = async () => {
        setOpen(!open);
        if (open === false) { // Only load comments when opening modal
            await loadComments();
            await handleViewUpdate();
        }
    };

    // Like Animation
    const handleIsLike = async () => {
        if (!currentUser) return;
        
        controls.start({ scale: [1, 1.2, 1], transition: { duration: 0.3 } });
        await handleLikeToggle();
    };

    return (
        <>
            {/* Project Card */}
            <ProjectCard
                handleIsModal={handleIsModal}
                imageUrls={artProjectItem?.project_imageUrls}
                title={artProjectItem?.project_title}
                creatorDocId={creatorDocId}
                creatorData={creatorData}
                isLiked={isLiked}
                currentUser={currentUser}
                controls={controls}
                handleIsLike={handleIsLike}
                likesNo={likesCount}
                viewsNo={viewsCount} />
            
            {/* Modal */}
            <ProjectModal
                open={open}
                setOpen={setOpen}
                creatorData={creatorData}
                creatorDocId={creatorDocId}
                artProjectItem={artProjectItem}
                currentUser={currentUser}
                controls={controls}
                isLiked={isLiked}
                handleIsLike={handleIsLike}
                likesNo={likesCount}
                viewsNo={viewsCount}
                usersData={usersData} />
        </>
    );
} 