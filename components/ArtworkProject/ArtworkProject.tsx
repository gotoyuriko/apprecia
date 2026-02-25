import GetComments from "@/firebase/comments/GetComments";
import UpdateLike from "@/firebase/likes/UpdateLike";
import UpdateView from "@/firebase/projectviews/UpdateView";
import GetUser from "@/firebase/users/GetUser";
import type { AnimationControls } from "framer-motion";
import { useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
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
    const [creatorData, setCreatorData] = useState<AppUser | null>(null);
    const [creatorDocId, setCreatorDocId] = useState('');
    const [open, setOpen] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likesNo, setLikesNo] = useState(artProjectItem.project_likesCount || 0);
    const [viewsNo, setViewsNo] = useState(artProjectItem.project_viewsCount || 0);

    // Fetch Data of Creator Data
    useEffect(() => {
        const fetchData = async () => {
            const result = await GetUser(artProjectItem.project_creator);
            if (result) {
                setCreatorData(result.user);
                setCreatorDocId(result.userid);
            }
        };
        fetchData();
    }, [artProjectItem]);

    // Open Modal
    const handleIsModal = async () => {
        setOpen(!open);
        fetchDataComments(creatorData?.user_email || '', artProjectItem.project_createdAt);
        if (currentUser) {
            const hasViewed = await UpdateView(creatorData?.user_email || '', artProjectItem.project_createdAt, currentUser);
            hasViewed ? setViewsNo((prevViewsNo) => prevViewsNo + 1) : setViewsNo(viewsNo);
        }
    };

    // LIKE FEATURE
    useEffect(() => {
        if (currentUser) {
            setIsLiked(artProjectItem.project_likedBy?.includes(currentUser.uid));
        }
    }, [artProjectItem, currentUser]);
    const controls: AnimationControls = useAnimation();
    // Like Animation https://www.framer.com/motion/use-animate/
    const handleIsLike = async () => {
        setIsLiked((prevIsLiked) => !prevIsLiked);
        controls.start({ scale: [1, 1.2, 1], transition: { duration: 0.3 } });
        await UpdateLike(artProjectItem.project_creator, artProjectItem.project_createdAt, !isLiked, currentUser!.uid);
        setLikesNo((prevLikesNo) => (isLiked ? prevLikesNo - 1 : prevLikesNo + 1));
    };

    // Comment Features
    const [commentData, setCommentData] = useState<any[]>([]);
    const [commentCurrentUserData, setCommentCurrentUserData] = useState<AppUser | null>(null);
    // Fetch Data of art gallery comments
    const fetchDataComments = (creatorDocId: string, createdAt: string) => {
        const fetchData = async () => {
            // Fetch Comments
            const commentData = await GetComments(creatorDocId, createdAt);
            setCommentData(commentData.reverse());
            // Fetch Current User
            if (currentUser?.email) {
                const result = await GetUser(currentUser.email);
                if (result) setCommentCurrentUserData(result.user);
            }
        };
        fetchData();
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
                likesNo={likesNo}
                viewsNo={viewsNo} />
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
                likesNo={likesNo}
                viewsNo={viewsNo}
                usersData={usersData}
                commentCurrentUserData={commentCurrentUserData}
                commentData={commentData}
                setCommentData={setCommentData} />
        </>
    );
}
