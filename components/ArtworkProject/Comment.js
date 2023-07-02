import GetArtworkId from "@/firebase/artworks/GetArtworkId";
import DeleteComment from "@/firebase/comments/DeleteComment";
import UpdateComment from "@/firebase/comments/UpdateComment";
import Image from "next/image";
import { useState } from "react";
import { IconContext } from "react-icons";
import { BiUserCircle, BiTrash, BiPencil } from "react-icons/bi";

export default function Comment({
    commentItem,
    userData,
    status,
    uid,
    user,
    createdAt,
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [updatedComment, setUpdatedComment] = useState(commentItem?.comment_content);
    const [hide, setHide] = useState(false);

    let filteredUser;

    if (status === "new") {
        filteredUser = userData;
    } else if (status === "old") {
        filteredUser = userData?.find(
            (userItem) => userItem.user_id === commentItem.user_id
        );
    }

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setUpdatedComment(commentItem?.comment_content);
    };

    const handleUpdate = async () => {
        try {
            const artworkId = await GetArtworkId(uid, createdAt);
            const { newUpdatedComment } = await UpdateComment(artworkId, commentItem, updatedComment);
            setUpdatedComment(newUpdatedComment);
        } catch (error) {
            console.error("Error updating comment", error);
        }
        setIsEditing(false);
    };

    const handleDelete = async () => {
        try {
            const artworkId = await GetArtworkId(uid, createdAt);
            await DeleteComment(artworkId, commentItem);
        } catch (e) {
            console.error("Error deleting comment", e);
        }

        setHide(true);
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
                        <p className="pt-2">{updatedComment}</p>
                    </>
                )}
                {
                    (user?.uid === commentItem?.user_id) && (
                        isEditing ? (
                            <div className="flex mt-2" >
                                <button
                                    className="mr-2 px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none"
                                    onClick={handleUpdate}
                                >
                                    Save
                                </button>
                                <button
                                    className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none"
                                    onClick={handleCancelEdit}
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <div className="flex mt-2">
                                <button
                                    className="mr-2 px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
                                    onClick={handleEdit}
                                >
                                    <BiPencil />
                                </button>
                                <button
                                    className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none"
                                    onClick={handleDelete}
                                >
                                    <BiTrash />
                                </button>
                            </div>
                        )
                    )
                }

            </div>
        </div>
    );
}
