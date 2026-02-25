import AddComment from "@/firebase/comments/AddComment";
import { useState } from "react";
import type { User } from "firebase/auth";
import type { ArtProject, AppUser } from "@/types";
import type { Dispatch, SetStateAction } from "react";
import Comment from "./Comment";

interface CommentSectionProps {
    artProjectItem: ArtProject;
    currentUser: User | null;
    commentData: any[];
    commentCurrentUserData: AppUser | null;
    usersData: AppUser[];
    setCommentData: Dispatch<SetStateAction<any[]>>;
}

export default function CommentSection({
    artProjectItem,
    currentUser,
    commentData,
    commentCurrentUserData,
    usersData,
    setCommentData
}: CommentSectionProps) {
    // Adding comment in the client side
    const [liveComments, setLiveComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState("");
    const [newCommentEmptyMsg, setNewCommentEmptyMsg] = useState('');

    // Comment Form
    const commentFormData = {
        comment_content: "",
        comment_user: commentCurrentUserData?.user_email
    };

    const handleAddComment = async () => {
        if (newComment === '') {
            setNewCommentEmptyMsg('Please write your comment.');
            return;
        }
        setNewCommentEmptyMsg('');

        const updatedFormData = {
            ...commentFormData,
            comment_content: newComment,
        };

        const result = await AddComment(
            artProjectItem.project_creator,
            artProjectItem.project_createdAt,
            updatedFormData as any
        );

        if (result) {
            setLiveComments([result.updatedCommentData, ...liveComments]);
        }
        setNewComment('');
    };

    // Callback function to update the commentItem
    const updateComment = (commentUser: string, createdAt: string, newComment: string) => {
        setCommentData((prevCommentData) => {
            return prevCommentData.map((comment) => {
                if (comment.comment_user === commentUser && comment.comment_createdAt === createdAt) {
                    return { ...comment, comment_content: newComment };
                }
                return comment;
            });
        });
    };

    return (
        <>
            <div className="my-10">
                <h3 className="text-lg font-bold mb-2">Comments</h3>
                {
                    currentUser && commentData.length === 0 && (
                        <p className="text-gray-500">
                            No comments yet. Be the first to comment!
                        </p>
                    )
                }

                {
                    currentUser && (
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
                            <p className="text-red-600 font-bold">{newCommentEmptyMsg}</p>
                        </div>
                    )
                }

                {liveComments
                    .map((newcomment, i) => {
                        return (
                            <Comment
                                key={i}
                                commentItem={newcomment}
                                commentUserData={commentCurrentUserData}
                                status="new"
                                currentUser={currentUser}
                                artProjectItem={artProjectItem}
                                setLiveComments={setLiveComments}
                            />
                        );
                    })}
                {commentData?.map((commentItem, j) => {
                    return (
                        <Comment
                            key={j}
                            commentItem={commentItem}
                            commentUserData={usersData}
                            status="old"
                            currentUser={currentUser}
                            artProjectItem={artProjectItem}
                            setLiveComments={setLiveComments}
                        />
                    );
                })}
            </div>
        </>
    );
}
