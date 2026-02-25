import type { AnimationControls } from "framer-motion";
import { useAnimation } from "framer-motion";
import { useState, useMemo } from "react";
import { useArtworkWithUser } from "@/firebase/hooks/useArtworkWithUser";
import { useArtworkInteractions } from "@/firebase/hooks/useArtworkInteractions";
import type { User } from "firebase/auth";
import type { ArtProject, AppUser } from "@/types";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";

interface ArtworkProjectProps {
    currentUser: User | null;
    artProjectItem: ArtProject;
    usersData: AppUser[];
}

export default function ArtworkProject({ currentUser, artProjectItem, usersData }: ArtworkProjectProps) {
    const [open, setOpen] = useState(false);

    // Use custom hooks for data and interactions
    const { artworksWithCreators } = useArtworkWithUser();
    const artworkWithCreator = useMemo(() =>
        artworksWithCreators.find(
            (a) => a.project_creator === artProjectItem?.project_creator &&
                   a.project_createdAt === artProjectItem?.project_createdAt
        ),
        [artworksWithCreators, artProjectItem]
    );
    const creatorData = (artworkWithCreator?.creatorData ?? null) as AppUser | null;

    // Derive creatorDocId: find the user index in usersData or fall back to empty string
    const creatorDocId = useMemo(() => {
        const match = usersData.find((u) => u.user_email === artProjectItem?.project_creator);
        return match ? artProjectItem?.project_creator ?? '' : artProjectItem?.project_creator ?? '';
    }, [usersData, artProjectItem]);

    const {
        isLiked,
        likeCount,
        handleLikeToggle,
        handleViewUpdate,
        loadComments
    } = useArtworkInteractions({
        creator: artProjectItem?.project_creator ?? '',
        createdAt: artProjectItem?.project_createdAt ?? '',
    });

    const likesCount = likeCount;
    const viewsCount = artProjectItem?.project_viewsCount ?? 0;

    const controls: AnimationControls = useAnimation();

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
