/* eslint-disable react-hooks/exhaustive-deps */
import AddComment from "@/firebase/comments/AddComment";
import GetComments from "@/firebase/comments/GetComments";
import GetUser from "@/firebase/users/GetUser";
import { useEffect, useState } from "react";
import Comment from "./Comment";

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
        comment_content: "",
        user_id: user.uid,
        user_name: "",
    };

    useEffect(() => {
        const fetchData = async () => {
            // Fetch Comments
            try {
                const data = await GetComments(uid, createdAt);
                // Convert createdAt strings to Date objects
                const convertedData = data.map(comment => ({
                    ...comment,
                    createdAt: new Date(comment.createdAt)
                }));
                // Sort the comments by createdAt date in ascending order
                const sortedData = convertedData.sort((a, b) => a.createdAt - b.createdAt);
                setCommentData(sortedData);
            } catch (error) {
                console.error("Error getting comments", error);
            }
            // Fetch Current User
            try {
                const data = await GetUser(user.uid);
                setCurrentUserData(data);
            } catch (error) {
                console.error("Error getting current user", error);
            }
            // Fetch Ohter Users
            try {
                const data = await GetUsers();
                setUserData(data);
            } catch (error) {
                console.error("Error getting users", error);
            }
        };

        fetchData();
    }, []);


    const handleAddComment = async () => {
        const updatedFormData = {
            ...commentFormData,
            comment: newComment,
            user_name: currentUserData.user_name
        };

        try {
            await AddComment(uid, createdAt, updatedFormData);
        } catch (e) {
            console.error("Error adding comment", e);
        }

        setLiveComments([...liveComments, updatedFormData]);
        setNewComment("");
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
                    liveComments.map((newcomment, index) => {
                        return (
                            <Comment commentItem={newcomment} key={index} userData={userData} />
                        )
                    })
                }
                {
                    commentData.map((commentItem, index) => {
                        <Comment commentItem={commentItem} key={index} userData={currentUserData} />
                    })
                }
            </div>
        </>
    );
}

