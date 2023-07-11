import GetArtwork from "@/firebase/artworks/GetArtwork";
import DeleteComment from "@/firebase/comments/DeleteComment";
import UpdateComment from "@/firebase/comments/UpdateComment";
import Image from "next/image";
// import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { IconContext } from "react-icons";
import { BiPencil, BiTrash, BiUserCircle } from "react-icons/bi";

export default function Comment({
    commentItem, // Single Comment Data
    commentUserData, // Users who have commented
    status,
    currentUser,
    artProjectItem, // Art Project 
    setLiveComments
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [updatedComment, setUpdatedComment] = useState(commentItem?.comment_content);
    const [displayComment, setDisplayComment] = useState('');
    // const router = useRouter();
    useEffect(() => {
        setDisplayComment(commentItem?.comment_content);
    }, [commentItem?.comment_content])

    const [hide, setHide] = useState(false);

    const filteredUser = useMemo(() => {
        if (status === "new") {
            return commentUserData;
        } else if (status === "old") {
            return commentUserData?.find((userItem) => userItem.user_email === commentItem.comment_user);
        }
    }, [status, commentUserData, commentItem.comment_user]);

    const handleEdit = () => {
        setUpdatedComment(displayComment);
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setUpdatedComment(commentItem?.comment_content);
    };

    const handleUpdate = async () => {
        const { id } = await GetArtwork(artProjectItem.project_creator, artProjectItem.project_createdAt);
        const { newUpdatedComment } = await UpdateComment(id, commentItem, updatedComment);
        setUpdatedComment(newUpdatedComment);
        setDisplayComment(newUpdatedComment);
        setIsEditing(false);
    };

    const handleDelete = async () => {
        const { id } = await GetArtwork(artProjectItem.project_creator, artProjectItem.project_createdAt);
        await DeleteComment(id, commentItem);
        if (setLiveComments !== null) {
            setLiveComments((prevLiveComments) => {
                const updatedLiveComments = prevLiveComments.filter((comment) => comment !== commentItem);
                return updatedLiveComments;
            });
        }
    };

    return (
        <div className={`${hide ? "hidden" : "flex"} items-center mt-4`}>
            <div className="flex items-center justify-center">
                <IconContext.Provider
                    value={{
                        size: "3.5rem",
                        className: "text-center",
                        title: "Profile menu",
                    }}
                >
                    {filteredUser?.user_photoURL ? (
                        <Image
                            width={50}
                            height={50}
                            src={filteredUser?.user_photoURL}
                            alt="Profile"
                            className="w-16 h-16 rounded-full object-cover"
                            priority
                            style={{ borderRadius: "50%", aspectRatio: "1/1" }}
                        />
                    ) : (
                        <BiUserCircle />
                    )}
                </IconContext.Provider>
            </div>
            <div className="flex justify-center flex-col ml-5">
                {isEditing ? (
                    <textarea
                        className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none"
                        value={updatedComment}
                        onChange={(e) => setUpdatedComment(e.target.value)}
                    ></textarea>
                ) : (
                    <>
                        <p className="font-bold">{filteredUser?.user_name}</p>
                        <p className="pt-2">{displayComment}</p>
                    </>
                )}
                {currentUser?.email === commentItem.comment_user && (
                    <div className="flex mt-2">
                        {isEditing ? (
                            <>
                                <button className="mr-2 px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none" onClick={handleUpdate}>
                                    Save
                                </button>
                                <button className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none" onClick={handleCancelEdit}>
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <>
                                <button className="mr-2 px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none" onClick={handleEdit}>
                                    <BiPencil />
                                </button>
                                <button className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none" onClick={handleDelete}>
                                    <BiTrash />
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
