import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Popover, Tooltip } from "@mui/material";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { IconContext } from "react-icons";
import { AiFillHeart, AiOutlineEye, AiOutlineHeart, AiOutlinePaperClip } from "react-icons/ai";
import { BiUserCircle, BiX } from "react-icons/bi";
import { FiMoreVertical } from "react-icons/fi";

export default function SelectRoomModal() {
    return (
        open && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 100 }}
                exit={{ opacity: 0 }}
                transition={{ ease: "easeOut", duration: 0.3 }}
                className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-80 bg-gray-900"
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
                                <Link href={`/profiles/${userData?.user_id}`}>
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
                                            <AiFillHeart className={`w-8 h-8 text-red-500 ${currentUser && "cursor-pointer"}`} />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            onClick={currentUser && handleIsLike}
                                            animate={controls}
                                        >
                                            <AiOutlineHeart className={`w-8 h-8 text-red-500 ${currentUser && "cursor-pointer"}`} />
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

                            {(currentUser && currentUser.uid === uid) ?
                                <>

                                    <Tooltip title="More" placement="right">
                                        <div className="flex flex-col items-center ml-10 hover:cursor-pointer"
                                            onClick={handleTooltip}>
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
                                            vertical: 'center',
                                            horizontal: 'center',
                                        }}
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'left',
                                        }}
                                    >
                                        <ul className="py-2">
                                            <li onClick={handleEdit} className="w-full h-full hover:bg-gray-200 px-4 text-lg hover:font-bold">Edit</li>
                                            <li onClick={handleDeleteOpen} className="w-full h-full hover:bg-gray-200 px-4 text-lg hover:font-bold">Delete</li>
                                        </ul>
                                    </Popover>
                                    <Dialog
                                        open={deleteOpen}
                                        onClose={handleDeleteClose}
                                        aria-labelledby="alert-dialog-title"
                                        aria-describedby="alert-dialog-description"
                                    >
                                        <DialogTitle id="alert-dialog-title">Delete Project</DialogTitle>
                                        <DialogContent>
                                            <DialogContentText id="alert-dialog-description">
                                                Are you sure you want to delete this project? This action cannot be undone.
                                            </DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={handleDeleteClose} color="primary">
                                                Cancel
                                            </Button>
                                            <Button onClick={handleDeleteProject} variant="contained" autoFocus>
                                                Delete
                                            </Button>
                                        </DialogActions>
                                    </Dialog>
                                </>
                                : null
                            }

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
                                href={link}
                                target="_blank"
                                className="flex items-center underline"
                            >
                                <AiOutlinePaperClip className="h-6 w-6" />{" "}
                                {link.replace(/(^\w+:|^)\/\/(www\.)?/i, "").slice(0, 15)}...
                            </Link>
                        )}
                    </div>
                    <BiX
                        className="absolute top-2 lg:top-4 right-6 lg:right-72 w-8 lg:w-10 h-8 lg:h-10 lg:text-white text-black cursor-pointer"
                        onClick={() => setOpen(false)}
                    />
                </motion.div>
            </motion.div>
        )
    );
}