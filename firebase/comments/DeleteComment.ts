import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../Config";
import type { Comment } from "@/types";

export default async function DeleteComment(
    projectId: string,
    commentItem: Comment
): Promise<void> {
    try {
        const artProjectDocRef = doc(db, "artProjects", projectId);
        const docSnap = await getDoc(artProjectDocRef);

        if (docSnap.exists()) {
            const artProjectData = docSnap.data();

            const commentIndex: number = artProjectData.project_comments.findIndex(
                (comment: Comment) =>
                    comment.comment_createdAt === commentItem.comment_createdAt &&
                    comment.comment_creator === commentItem.comment_creator
            );

            if (commentIndex !== -1) {
                artProjectData.project_comments.splice(commentIndex, 1);
                await setDoc(artProjectDocRef, artProjectData);
            } else {
                console.error("Comment not found.");
            }
        } else {
            console.error("Art project document not found.");
        }
    } catch (error: unknown) {
        console.error("Error deleting comment", error);
    }
}
