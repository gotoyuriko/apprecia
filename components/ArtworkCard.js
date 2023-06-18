import { Card, CardActionArea, CardActions, CardMedia } from '@mui/material';
import { AiFillHeart, AiOutlineEye, AiOutlineHeart, AiOutlinePaperClip } from 'react-icons/ai';
import { useEffect, useState } from 'react';
import GetUser from '@/firebase/users/GetUser';
import Image from 'next/image';
import { BiUserCircle, BiX } from 'react-icons/bi';
import Link from 'next/link';
import { motion } from "framer-motion";
import { IconContext } from 'react-icons/lib';

export default function ArtworkCard({ title, description, imageUrls, tags, skills, link, uid }) {
    const [userData, setUserData] = useState(null);
    const [open, setOpen] = useState(false);
    // Hide Scroll Bar when you trigger modal
    open ? document.body.style.overflowY = 'hidden' : document.body.style.overflowY = 'unset';

    // Favorite Feature
    const [isFavorite, setIsFavorite] = useState({ count: 0, liked: false });
    const handleIsFavorite = () => {
        setIsFavorite({
            count: isFavorite.count + (isFavorite.liked ? -1 : 1),
            liked: !isFavorite.liked
        });

    }

    //Fetch Database
    useEffect(() => {
        if (uid) {
            GetUser(uid)
                .then((data) => {
                    setUserData(data);
                })
                .catch((error) => {
                    console.error("Error getting user:", error);
                });
        }
    }, [uid]);

    return (
        <>
            {/* Project Card */}
            <Card sx={{ maxWidth: 345 }} onClick={() => setOpen(!open)}>
                <CardActionArea>
                    <CardMedia component="img" sx={{ height: "200px", width: "100%", objectFit: "cover" }} image={imageUrls[0]} />
                </CardActionArea>
                <CardActions className="flex justify-between items-center">
                    <div className="flex flex-col">
                        <p className="text-xl font-bold">{title}</p>
                        <p className="text-sm text-gray-400">
                            {userData?.user_name ? `By ${userData.user_name}` : ""}
                        </p>
                    </div>
                    <div className="flex flex-row">
                        <div className="flex flex-row">
                            <AiOutlineHeart className="w-6 h-6" />
                            <span className="ml-2">10</span>
                        </div>
                        <div className="flex flex-row">
                            <AiOutlineEye className="ml-3 w-6 h-6" />
                            <span className="ml-2">10</span>
                        </div>
                    </div>
                </CardActions>
            </Card>

            {/* Modal */}
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 100 }}
                    exit={{ opacity: 0 }}
                    transition={{ ease: "easeOut", duration: 0.3 }}
                    className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-80 bg-gray-900">
                    <motion.div
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                        transition={{ ease: "easeOut", duration: 0.3 }}
                        className="bg-white w-full lg:w-1/2 h-screen rounded-lg p-6 overflow-y-scroll">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                {userData?.user_photoURL ? (
                                    <Image
                                        src={userData.user_photoURL}
                                        alt="Profile"
                                        width={50}
                                        height={50}
                                        className="w-16 h-16 rounded-full drop-shadow-md border-2"
                                        priority
                                    />
                                ) : (
                                    <BiUserCircle className="w-16 h-16" />
                                )}
                                <div className="flex flex-col">
                                    <p className="font-medium text-gray-700">{title}</p>
                                    {/* Render user name */}
                                    {userData?.user_name && (
                                        <p className="text-sm font-normal text-gray-400">{userData.user_name}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center justify-around pt-5 lg:pt-0">
                                <div className="flex flex-col items-center">
                                    <IconContext.Provider value={{ color: "red" }} onClick={handleIsFavorite}>
                                        {isFavorite.liked ?
                                            <AiFillHeart className={`w-8 h-8 text-red-500 cursor-pointer`} onClick={handleIsFavorite} />
                                            : <AiOutlineHeart className={`w-8 h-8 cursor-pointer`} onClick={handleIsFavorite} />}
                                    </IconContext.Provider>
                                    <p className="font-medium text-sm text-gray-400">{isFavorite.count}</p>
                                </div>
                                <div className="flex flex-col items-center ml-10">
                                    <IconContext.Provider value={{ color: "gray" }}>
                                        <AiOutlineEye className="w-8 h-8" />
                                    </IconContext.Provider>
                                    <p className="font-medium text-sm text-gray-400">553,031</p>
                                </div>
                            </div>
                        </div>
                        <hr className="my-4" />
                        <div className="grid grid-cols-1 gap-4">
                            {imageUrls.map((imageUrl, index) => (
                                <Image
                                    key={index}
                                    src={imageUrl}
                                    alt="project artwork"
                                    width={600}
                                    height={800}
                                    className="w-full h-full object-cover object-center"
                                />
                            ))}
                        </div>
                        <p className="text-justify mt-4">{description}</p>
                        <hr className="my-4" />
                        <div className='flex items-center flex-row justify-between'>
                            <div className="flex items-center justify-start">
                                <div className='mr-5'>
                                    <p className="font-normal text-sm">Tags</p>
                                    <div className="flex flex-wrap gap-1">
                                        {tags?.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="text-sm text-white p-1.5 rounded"
                                                style={{ backgroundColor: tag.color ? tag.color : '#aaa' }}
                                            >
                                                {tag.label}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="font-normal text-sm">Skills</p>
                                    <div className="flex flex-wrap gap-1">
                                        {skills?.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="text-sm text-white p-1.5 rounded"
                                                style={{ backgroundColor: skill.color ? skill.color : '#aaa' }}
                                            >
                                                {skill.label}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {link && link !== '' && (
                                <Link href={link} target="_blank" className="flex items-center underline">
                                    <AiOutlinePaperClip className="h-6 w-6" /> Vist {link.replace(/(^\w+:|^)\/\/(www\.)?/i, '').slice(0, 15)}...
                                </Link>
                            )}
                        </div>
                        <BiX
                            className="absolute top-2 lg:top-4 right-6 lg:right-72 w-8 lg:w-10 h-8 lg:h-10 lg:text-white text-black cursor-pointer"
                            onClick={() => setOpen(!open)}
                        />
                    </motion.div>
                </motion.div >
            )}
        </>
    );
}