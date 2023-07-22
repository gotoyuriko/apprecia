import { Card, CardActionArea, CardActions, CardMedia } from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";
import { IconContext } from "react-icons";
import { AiFillHeart, AiOutlineEye, AiOutlineHeart } from "react-icons/ai";

export default function ProjectCard({
    handleIsModal,
    imageUrls, title,
    creatorDocId, creatorData, currentUser,
    isLiked, controls, handleIsLike,
    likesNo, viewsNo }) {

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
                                <motion.div onClick={currentUser && handleIsLike} animate={controls}>
                                    <AiFillHeart className={`w-6 h-6 text-red-500 ${currentUser && "cursor-pointer"}`} />
                                </motion.div>
                            ) : (
                                <motion.div onClick={currentUser && handleIsLike} animate={controls}>
                                    <AiOutlineHeart className={`w-6 h-6 text-red-500 ${currentUser && "cursor-pointer"}`} />
                                </motion.div>
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
    )
}