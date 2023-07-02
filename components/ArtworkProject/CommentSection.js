/* eslint-disable react-hooks/exhaustive-deps */
import AddComment from "@/firebase/comments/AddComment";
import { useState } from "react";
import Comment from "./Comment";

export default function CommentSection({
    uid,
    createdAt,
    user,
    commentData,
    commentUserData,
    commentCurrentUserData,
}) {
    // Adding comment in the client side
    const [liveComments, setLiveComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    // Comment Form
    const commentFormData = {
        comment_content: "",
        user_id: user?.uid,
        user_name: "",
    };

    const handleAddComment = async () => {
        const updatedFormData = {
            ...commentFormData,
            comment_content: newComment,
            user_name: commentCurrentUserData?.user_name,
        };

        try {
            const { updatedCommentData } = await AddComment(uid, createdAt, updatedFormData);
            setLiveComments([updatedCommentData, ...liveComments]);
            setNewComment("");
        } catch (e) {
            console.error("Error adding comment", e);
        }
    };

    return (
        <>
            <div className="my-10">
                <h3 className="text-lg font-bold mb-2">Comments</h3>
                {
                    user && commentData.length === 0 && (
                        <p className="text-gray-500">
                            No comments yet. Be the first to comment!
                        </p>
                    )
                }

                {
                    user && (
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
                    )
                }

                {liveComments.map((newcomment, index) => {
                    return (
                        <Comment
                            commentItem={newcomment}
                            key={index}
                            userData={commentCurrentUserData}
                            status="new"
                            uid={uid}
                            user={user}
                            createdAt={createdAt}
                        />
                    );
                })}
                {commentData?.map((commentItem, index) => {
                    return (
                        <Comment
                            commentItem={commentItem}
                            key={index}
                            userData={commentUserData}
                            status="old"
                            uid={commentCurrentUserData.user_id}
                            user={user}
                            createdAt={createdAt}
                        />
                    );
                })}
            </div>
        </>
    );
}
