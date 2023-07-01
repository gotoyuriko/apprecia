import AddComment from "@/firebase/comments/AddComment";
import GetComments from "@/firebase/comments/GetComments";
import GetUser from "@/firebase/users/GetUser";
import Image from "next/image";
import { useEffect, useState } from "react";
import { IconContext } from "react-icons";
import { BiUserCircle } from "react-icons/bi";

export default function CommentSection({ uid, createdAt, user }) {
    // Adding comment in the client side
    const [liveComments, setLiveComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    // From Firebase
    const [commentData, setCommentData] = useState([]);
    // Other Users
    const [userData, setUserData] = useState({});
    // Current User
    const [currentUserData, setCurrentUserData] = useState([]);
    // Comment Form
    const commentFormData = {
        comment: "",
        user_id: user.uid,
        user_name: "",
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await GetComments(uid, createdAt);
                setCommentData(data);
            } catch (error) {
                console.error("Error getting comments", error);
            }
            try {
                const data = await GetUser(user.uid);
                setCurrentUserData(data);
            } catch (error) {
                console.error("Error getting current user", error);
            }
        };

        fetchData();
    }, [uid, createdAt, user.uid]);


    const handleAddComment = async () => {
        // Update the commentFormData object with the new comment text
        const updatedFormData = {
            ...commentFormData,
            comment: newComment,
            user_name: currentUserData.user_name
        };

        try {
            await AddComment(uid, createdAt, updatedFormData);
            const updatedComments = [...liveComments, updatedFormData];
            setLiveComments(updatedComments);
            setNewComment("");
        } catch (e) {
            console.error("Error adding comment", e);
        }
    };




    const renderComment = (commentItem, index) => {
        const fetchUser = async () => {
            try {
                const user = await GetUser(commentItem?.user_id);
                setUserData(user);
            } catch (error) {
                console.error("Error getting user", error);
            }
        };

        fetchUser();
        return (
            <div key={index} className="flex items-center mt-4">
                <div className="flex items-center justify-center">
                    <IconContext.Provider
                        value={{
                            size: "3.5rem",
                            className: "text-center",
                            title: "Profile menu",
                        }}
                    >
                        {userData?.user_photoURL ? (
                            <Image
                                width={50}
                                height={50}
                                src={userData?.user_photoURL}
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
                    <p className="font-bold">{userData?.user_name}</p>
                    <p className="pt-2">{commentItem?.comment}</p>
                </div>
            </div>
        );
    };


    return (
        <>
            <div className="my-10">
                <h3 className="text-lg font-bold mb-2">Comments</h3>
                {liveComments.length === 0 && commentData.length === 0 && (
                    <p className="text-gray-500">No comments yet. Be the first to comment!</p>
                )}
                <div className="mt-4">
                    <textarea
                        className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none"
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    ></textarea>
                    <button
                        className="mt-2 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 focus:outline-none"
                        onClick={handleAddComment}
                    >
                        Post Comment
                    </button>
                </div>
                {
                    liveComments.map((comment, index) => {
                        return (
                            <div key={index} className="flex items-center mt-4">
                                <div className="flex items-center justify-center">
                                    <IconContext.Provider
                                        value={{
                                            size: "3.5rem",
                                            className: "text-center",
                                            title: "Profile menu",
                                        }}
                                    >
                                        {currentUserData?.user_photoURL ? (
                                            <Image
                                                width={50}
                                                height={50}
                                                src={currentUserData?.user_photoURL}
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
                                    <p className="font-bold">{currentUserData?.user_name}</p>
                                    <p className="pt-2">{comment?.comment}</p>
                                </div>
                            </div>
                        )
                    })
                }
                {
                    commentData.map((commentItem, index) => {
                        return renderComment(commentItem, index);
                    })
                }
            </div>
        </>
    );
}

