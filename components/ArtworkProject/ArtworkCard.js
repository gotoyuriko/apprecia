import {
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardMedia,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Popover,
    Tooltip,
} from "@mui/material";
import {
    AiFillHeart,
    AiOutlineEye,
    AiOutlineHeart,
    AiOutlinePaperClip,
} from "react-icons/ai";
import { useEffect, useState } from "react";
import GetUser from "@/firebase/users/GetUser";
import Image from "next/image";
import { BiUserCircle, BiX } from "react-icons/bi";
import Link from "next/link";
import { motion, useAnimation } from "framer-motion";
import { IconContext } from "react-icons/lib";
import UpdateLike from "@/firebase/likes/UpdateLike";
import { useAuth } from "@/firebase/auth/AuthContext";
import UpdateView from "@/firebase/projectviews/UpdateView";
import { FiMoreVertical } from "react-icons/fi";
import GetArtworkId from "@/firebase/artworks/GetArtworkId";
import { useRouter } from "next/router";
import DeleteArtwork from "@/firebase/artworks/DeleteArtwork";
import CommentSection from "./CommentSection";
import GetComments from "@/firebase/comments/GetComments";
import GetUsers from "@/firebase/users/GetUsers";

export default function ArtworkCard({
    title,
    description,
    imageUrls,
    tags,
    skills,
    link,
    uid,
    createdAt,
    likesCount,
    likedBy,
    viewsCount,
}) {
    const { currentUser } = useAuth();
    const router = new useRouter();

    const [userData, setUserData] = useState(null);
    const [open, setOpen] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likesNo, setLikesNo] = useState(likesCount);
    const [viewsNo, setViewsNo] = useState(viewsCount);

    // Scroll Behavior
    useEffect(() => {
        document.body.style.overflowY = open ? "hidden" : "unset";
    }, [open]);

    //Check if artwork was liked by you
    useEffect(() => {
        if (currentUser) {
            setIsLiked(likedBy.includes(currentUser.uid));
        }
    }, [likedBy, currentUser, title]);

    // Fetch Data of Creator Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await GetUser(uid);
                setUserData(data);
            } catch (error) {
                console.error("Error getting user:", error);
            }
        };
        fetchData();
    }, [uid]);

    // From Firebase
    const [commentData, setCommentData] = useState([]);
    // Other Users
    const [commentUserData, setCommentUserData] = useState([]);
    // Current User
    const [commentCurrentUserData, setCommentCurrentUserData] = useState([]);
    // Fetch Data of art gallery comments
    const fetchDataComments = (uid, createdAt) => {
        const fetchData = async () => {
            // Fetch Comments
            try {
                const data = await GetComments(uid, createdAt);
                setCommentData(data.reverse());
            } catch (error) {
                console.error("Error getting comments", error);
            }
            // Fetch Current User
            try {
                const data = await GetUser(currentUser.uid);
                setCommentCurrentUserData(data);
            } catch (error) {
                console.error("Error getting current user", error);
            }
            // Fetch Ohter Users
            try {
                const data = await GetUsers();
                setCommentUserData(data);
            } catch (error) {
                console.error("Error getting users", error);
            }
        };

        fetchData();
    };

    // Open Modal
    const handleIsModal = async () => {
        setOpen(!open);
        fetchDataComments(uid, createdAt);
        const hasViewed = await UpdateView(uid, createdAt, currentUser);
        hasViewed
            ? setViewsNo((prevViewsNo) => prevViewsNo + 1)
            : setViewsNo(viewsNo);
    };

    /*
     * Like Animation https://www.framer.com/motion/use-animate/
     */
    const controls = useAnimation();
    // Give / Remove Likes
    const handleIsLike = async () => {
        setIsLiked((prevIsLiked) => !prevIsLiked);
        controls.start({ scale: [1, 1.2, 1], transition: { duration: 0.3 } });
        await UpdateLike(uid, createdAt, !isLiked, currentUser.uid);
        setLikesNo((prevLikesNo) => (isLiked ? prevLikesNo - 1 : prevLikesNo + 1));
    };

    // Tooltip
    const [tooltip, setTooltip] = useState(null);
    const handleTooltip = (event) => {
        setTooltip(event.currentTarget);
    };
    const handleTooltipClose = () => {
        setTooltip(null);
    };
    const tooltipOpen = Boolean(tooltip);
    const id = tooltipOpen ? "simple-popover" : undefined;

    // Edit Project
    const handleEdit = () => {
        const fetchData = async () => {
            try {
                const artworkId = await GetArtworkId(uid, createdAt);
                router.push(`/projects/update/${artworkId}`);
            } catch (error) {
                console.error("Error getting artwork id:", error);
            }
        };

        fetchData();
    };

    const [deleteOpen, setDeleteOpen] = useState(false);
    // Delete Project
    const handleDeleteOpen = () => {
        setDeleteOpen(true);
    };
    const handleDeleteClose = () => {
        setDeleteOpen(false);
    };

    const handleDeleteProject = async () => {
        const artworkId = await GetArtworkId(uid, createdAt);

        if (artworkId) {
            try {
                await DeleteArtwork(imageUrls, artworkId);
                router.reload();
            } catch (error) {
                console.error("Error deleting artwork:", error);
            }
        } else {
            console.error("Artwork not found");
        }
    };

    return (
        <>
            {/* Project Card */}
            <Card sx={{ maxWidth: 380 }}>
                <CardActionArea onClick={handleIsModal}>
                    <CardMedia
                        component="img"
                        sx={{ height: "200px", width: "100%", objectFit: "cover" }}
                        image={imageUrls[0]}
                    />
                </CardActionArea>
                <CardActions className="flex justify-between items-center">
                    <div className="flex flex-col">
                        <p className="text-xl font-bold">{title}</p>
                        <Link
                            passHref
                            href={`/profiles/${userData?.user_id}`}
                            className="text-sm text-gray-400"
                        >
                            {userData?.user_name ? `By ${userData.user_name}` : ""}
                        </Link>
                    </div>
                    <div className="flex flex-row">
                        <div className="flex flex-col items-center mr-2">
                            <IconContext.Provider value={{ color: "red" }}>
                                {isLiked && currentUser ? (
                                    <motion.div
                                        onClick={currentUser && handleIsLike}
                                        animate={controls}
                                    >
                                        <AiFillHeart
                                            className={`w-6 h-6 text-red-500 ${currentUser && "cursor-pointer"
                                                }`}
                                        />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        onClick={currentUser && handleIsLike}
                                        animate={controls}
                                    >
                                        <AiOutlineHeart
                                            className={`w-6 h-6 text-red-500 ${currentUser && "cursor-pointer"
                                                }`}
                                        />
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
            </Card>

            {/* Modal */}
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 100 }}
                    exit={{ opacity: 0 }}
                    transition={{ ease: "easeOut", duration: 0.3 }}
                    className="fixed inset-0 flex items-center justify-evenly z-50 bg-opacity-80 bg-gray-900"
                >
                    <motion.div
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                        transition={{ ease: "easeOut", duration: 0.3 }}
                        className="bg-white w-full lg:w-1/2 h-screen rounded-lg p-6 overflow-y-scroll"
                    >
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                {userData?.user_photoURL ? (
                                    <Link passHref href={`/profiles/${userData?.user_id}`}>
                                        <Image
                                            src={userData.user_photoURL}
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
                                <div className="flex flex-col">
                                    <p className="font-medium text-gray-700">{title}</p>
                                    {userData?.user_name && (
                                        <Link
                                            href={`/profiles/${userData?.user_id}`}
                                            className="text-sm font-normal text-gray-400"
                                        >
                                            {userData.user_name}
                                        </Link>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center justify-around pt-5 lg:pt-0">
                                <div className="flex flex-col items-center">
                                    <IconContext.Provider value={{ color: "red" }}>
                                        {isLiked && currentUser ? (
                                            <motion.div
                                                onClick={currentUser && handleIsLike}
                                                animate={controls}
                                            >
                                                <AiFillHeart
                                                    className={`w-8 h-8 text-red-500 ${currentUser && "cursor-pointer"
                                                        }`}
                                                />
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                onClick={currentUser && handleIsLike}
                                                animate={controls}
                                            >
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

                                {currentUser && currentUser.uid === uid ? (
                                    <>
                                        <Tooltip title="More" placement="right">
                                            <div
                                                className="flex flex-col items-center ml-10 hover:cursor-pointer"
                                                onClick={handleTooltip}
                                            >
                                                <IconContext.Provider value={{ color: "gray" }}>
                                                    <FiMoreVertical className="w-8 h-8" />
                                                </IconContext.Provider>
                                            </div>
                                        </Tooltip>
                                        <Popover
                                            id={id}
                                            open={tooltipOpen}
                                            anchorEl={tooltip}
                                            onClose={handleTooltipClose}
                                            anchorOrigin={{
                                                vertical: "center",
                                                horizontal: "center",
                                            }}
                                            transformOrigin={{
                                                vertical: "top",
                                                horizontal: "left",
                                            }}
                                        >
                                            <ul className="py-2">
                                                <li
                                                    onClick={handleEdit}
                                                    className="w-full h-full hover:bg-gray-200 px-4 text-lg hover:font-bold"
                                                >
                                                    Edit
                                                </li>
                                                <li
                                                    onClick={handleDeleteOpen}
                                                    className="w-full h-full hover:bg-gray-200 px-4 text-lg hover:font-bold"
                                                >
                                                    Delete
                                                </li>
                                            </ul>
                                        </Popover>
                                        <Dialog
                                            open={deleteOpen}
                                            onClose={handleDeleteClose}
                                            aria-labelledby="alert-dialog-title"
                                            aria-describedby="alert-dialog-description"
                                        >
                                            <DialogTitle id="alert-dialog-title">
                                                Delete Project
                                            </DialogTitle>
                                            <DialogContent>
                                                <DialogContentText id="alert-dialog-description">
                                                    Are you sure you want to delete this project? This
                                                    action cannot be undone.
                                                </DialogContentText>
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={handleDeleteClose} color="primary">
                                                    Cancel
                                                </Button>
                                                <Button
                                                    onClick={handleDeleteProject}
                                                    variant="contained"
                                                    autoFocus
                                                >
                                                    Delete
                                                </Button>
                                            </DialogActions>
                                        </Dialog>
                                    </>
                                ) : null}
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
                        <div className="flex items-center flex-row justify-between">
                            <div className="flex items-center justify-start">
                                <div className="mr-5">
                                    <p className="font-normal text-sm">Tags</p>
                                    <div className="flex flex-wrap gap-1">
                                        {tags?.map((tag, index) => (
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
                                </div>
                                <div>
                                    <p className="font-normal text-sm">Skills</p>
                                    <div className="flex flex-wrap gap-1">
                                        {skills?.map((skill, index) => (
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
                                </div>
                            </div>

                            {link && link !== "" && (
                                <Link
                                    passHref
                                    href={link}
                                    target="_blank"
                                    className="flex items-center underline"
                                >
                                    <AiOutlinePaperClip className="h-6 w-6" />{" "}
                                    {link.replace(/(^\w+:|^)\/\/(www\.)?/i, "").slice(0, 15)}...
                                </Link>
                            )}
                        </div>

                        <CommentSection
                            uid={uid}
                            createdAt={createdAt}
                            user={currentUser}
                            commentData={commentData}
                            commentUserData={commentUserData}
                            commentCurrentUserData={commentCurrentUserData}
                        />

                        <BiX
                            className="absolute top-2 lg:top-4 right-6 lg:right-72 w-8 lg:w-10 h-8 lg:h-10 lg:text-white text-black cursor-pointer"
                            onClick={() => setOpen(false)}
                        />
                    </motion.div>
                </motion.div>
            )}
        </>
    );
}
