import { Card, CardActionArea, CardActions, CardMedia } from "@mui/material";
import type { AnimationControls } from "framer-motion";
import { motion } from "framer-motion";

// Cast to any to work around framer-motion v10 / React 19 type incompatibility
const MotionDiv = motion.div as React.ComponentType<any>;
import Link from "next/link";
import { IconContext } from "react-icons";
import { AiFillHeart, AiOutlineEye, AiOutlineHeart } from "react-icons/ai";
import type { User } from "firebase/auth";
import type { AppUser } from "@/types";

interface ProjectCardProps {
    handleIsModal: () => void;
    imageUrls: string[];
    title: string;
    creatorDocId: string;
    creatorData: AppUser | null;
    currentUser: User | null;
    isLiked: boolean;
    controls: AnimationControls;
    handleIsLike: () => void;
    likesNo: number;
    viewsNo: number;
}

export default function ProjectCard({
    handleIsModal,
    imageUrls, title,
    creatorDocId, creatorData, currentUser,
    isLiked, controls, handleIsLike,
    likesNo, viewsNo }: ProjectCardProps) {

    const replacedTitle = title.trim().length > 20 ? title.trim().substring(0, 20).concat('', '...') : title.trim();

    return (
        <Card sx={{ maxWidth: 380 }} className="mx-auto h-full" >
            <CardActionArea onClick={() => handleIsModal()}>
                <CardMedia component="img" sx={{ height: "200px", width: "100%", objectFit: "cover" }} image={imageUrls[0]} />
            </CardActionArea>
            <CardActions className="flex justify-between items-center">
                <div className="flex flex-col">
                    <p className="text-md md:text-lg  font-bold">{replacedTitle}</p>
                    <Link passHref href={`/profiles/${creatorDocId}`} className="text-sm text-gray-400">
                        {creatorData?.user_name ? `By ${creatorData.user_name}` : ''}
                    </Link>
                </div>
                <div className="flex flex-row">
                    <div className="flex flex-col items-center mr-2">
                        <IconContext.Provider value={{ color: "red" }}>
                            {isLiked && currentUser ? (
                                <MotionDiv onClick={currentUser ? handleIsLike : undefined} animate={controls}>
                                    <AiFillHeart className={`w-6 h-6 text-red-500 ${currentUser && "cursor-pointer"}`} />
                                </MotionDiv>
                            ) : (
                                <MotionDiv onClick={currentUser ? handleIsLike : undefined} animate={controls}>
                                    <AiOutlineHeart className={`w-6 h-6 text-red-500 ${currentUser && "cursor-pointer"}`} />
                                </MotionDiv>
                            )}
                        </IconContext.Provider>
                        <span className="text-sm">{likesNo}</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <IconContext.Provider value={{ color: "gray" }}>
                            <AiOutlineEye className="w-6 h-6" />
                        </IconContext.Provider>
                        <span className="text-sm">{viewsNo}</span>
                    </div>
                </div>
            </CardActions>
        </Card >
    );
}
