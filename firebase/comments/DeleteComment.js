import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../Config";

export default async function DeleteComment(projectId, commentItem) {
    try {
        const artProjectDocRef = doc(db, "artProjects", projectId);
        const docSnap = await getDoc(artProjectDocRef);

        if (docSnap.exists()) {
            const artProjectData = docSnap.data();

            const commentIndex = artProjectData.project_comments.findIndex(
                (comment) =>
                    comment.comment_createdAt === commentItem.comment_createdAt &&
                    comment.user_id === commentItem.user_id
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
    } catch (error) {
        console.error("Error deleting comment", error);
    }
}
