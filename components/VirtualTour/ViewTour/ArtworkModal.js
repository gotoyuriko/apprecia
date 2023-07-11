import CommentSection from "@/components/ArtworkProject/CommentSection";
import UpdateLike from "@/firebase/likes/UpdateLike";
import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IconContext } from "react-icons";
import { AiFillHeart, AiOutlineEye, AiOutlineHeart, AiOutlinePaperClip } from "react-icons/ai";
import { BiUserCircle, BiX } from "react-icons/bi";

export default function ArtworkModal({
    setOpen,
    open,
    tourUser,
    showDesc,
    viewsNo,
    setViewsNo,
    currentUser,
    commentData,
    usersData,
    setCommentData,
    commentCurrentUserData,
    tourUserId
}) {
    const [isLiked, setIsLiked] = useState(false);
    const [likesNo, setLikesNo] = useState(0);
    // Check if artwork was liked by you
    useEffect(() => {

        if (currentUser) {
            setIsLiked(showDesc?.project_likedBy?.includes(currentUser.uid));
        }
    }, [showDesc?.project_likedBy, currentUser]);

    useEffect(() => {
        setLikesNo(showDesc?.project_likesCount || 0);
        setViewsNo(showDesc?.project_viewsCount || 0);
    }, [showDesc?.project_likesCount, showDesc?.project_viewsCount, setViewsNo]);

    /*
     * Like Animation https://www.framer.com/motion/use-animate/
     */
    const controls = useAnimation();
    // Give / Remove Likes
    const handleIsLike = async () => {
        setIsLiked((prevIsLiked) => !prevIsLiked);
        controls.start({ scale: [1, 1.2, 1], transition: { duration: 0.3 } });
        if (showDesc?.project_creator && showDesc?.project_createdAt) {
            await UpdateLike(showDesc.project_creator, showDesc.project_createdAt, !isLiked, currentUser.uid);
            console.log('asdf')
        }
        setLikesNo((prevLikesNo) => (isLiked ? prevLikesNo - 1 : prevLikesNo + 1));
    };

    return open ? (
        <motion.div
            initial={{ x: -100 }}
            animate={{ x: 0 }}
            exit={{ x: -100 }}
            transition={{ ease: "easeOut", duration: 0.4 }}
            className="z-20 absolute left-0 top-0 w-full  lg:w-1/4 h-full bg-white shadow overflow-y-scroll"
        >
            <BiX
                className="absolute top-2 right-2 w-10 h-10 text-black cursor-pointer"
                onClick={() => setOpen(false)}
            />
            <div className="p-10">
                <div>
                    <h1 className="text-4xl font-bold">{showDesc?.project_title}</h1>
                    <p className="text-justify mt-5">{showDesc?.project_description}</p>
                </div>
            </div>
            <div className="px-10">
                <p className="font-bold">Tags</p>
                {showDesc?.project_tags?.map((tag, index) => (
                    <span
                        key={index}
                        className="text-sm text-white p-1.5 rounded"
                        style={{
                            backgroundColor: tag.color ? tag.color : "#aaa",
                        }}
                    >
                        {tag.label}
                    </span>
                ))}
            </div>
            <div className="px-10 mt-5">
                <p className="font-bold">Skills</p>
                {showDesc?.project_skills?.map((skill, index) => (
                    <span
                        key={index}
                        className="text-sm text-white p-1.5 rounded"
                        style={{
                            backgroundColor: skill.color ? skill.color : "#aaa",
                        }}
                    >
                        {skill.label}
                    </span>
                ))}
            </div>
            <div className="px-10 mt-5">
                {showDesc?.project_link !== "" && showDesc?.project_link !== null ? (
                    <div key={showDesc?.project_link}>
                        <p className="font-bold">Links</p>
                        <Link
                            passHref
                            className="flex items-center underline"
                            href={showDesc?.project_link}
                            target="_blank"
                        >
                            <AiOutlinePaperClip className="h-6 w-6" />
                            {showDesc?.project_link
                                .replace(/(^\w+:|^)\/\/(www\.)?/i, "")
                                .slice(0, 20)}
                            ...
                        </Link>
                    </div>
                ) : null}
            </div>

            <hr className="my-4" />

            <div className="flex items-center justify-between mt-4 px-8">
                <div className="flex items-center">
                    {tourUser?.user_photoURL ? (
                        <Link passHref href={`/profiles/${tourUserId}`}>
                            <Image
                                src={tourUser.user_photoURL}
                                alt="Profile"
                                width={50}
                                height={50}
                                className="w-16 h-16 rounded-full drop-shadow-md border-2"
                                priority
                            />
                        </Link>
                    ) : (
                        <BiUserCircle className="w-16 h-16" />
                    )}
                    <div className="flex flex-col ml-3">
                        <p className="font-medium text-gray-700">created by</p>
                        {tourUser?.user_name && (
                            <Link
                                passHref
                                href={`/profiles/${tourUserId}`}
                                className="text-sm font-normal text-gray-400"
                            >
                                {tourUser.user_name}
                            </Link>
                        )}
                    </div>
                </div>
                <div className="flex">
                    <div className="flex flex-col items-center">
                        <IconContext.Provider value={{ color: "red" }}>
                            {isLiked && currentUser ? (
                                <motion.div onClick={currentUser && handleIsLike} animate={controls}>
                                    <AiFillHeart
                                        className={`w-8 h-8 text-red-500 ${currentUser && "cursor-pointer"
                                            }`}
                                    />
                                </motion.div>
                            ) : (
                                <motion.div onClick={currentUser && handleIsLike} animate={controls}>
                                    <AiOutlineHeart
                                        className={`w-8 h-8 text-red-500 ${currentUser && "cursor-pointer"
                                            }`}
                                    />
                                </motion.div>
                            )}
                        </IconContext.Provider>
                        <p className="font-medium text-sm text-gray-400">{likesNo}</p>
                    </div>
                    <div className="flex flex-col items-center ml-10">
                        <IconContext.Provider value={{ color: "gray" }}>
                            <AiOutlineEye className="w-8 h-8" />
                        </IconContext.Provider>
                        <p className="font-medium text-sm text-gray-400">{viewsNo}</p>
                    </div>
                </div>
            </div>
            <div className="px-5">
                <CommentSection
                    artProjectItem={showDesc}
                    currentUser={currentUser}
                    commentData={commentData}
                    usersData={usersData}
                    commentCurrentUserData={commentCurrentUserData}
                    setCommentData={setCommentData}
                />
            </div>
        </motion.div>
    ) : null;
}
