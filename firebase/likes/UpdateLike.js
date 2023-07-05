import {
    arrayRemove,
    arrayUnion,
    collection,
    doc,
    getDocs,
    increment,
    query,
    updateDoc,
    where,
} from "firebase/firestore";
import { db } from "../Config";

export default async function UpdateLike(
    user_id,
    createdAt,
    isLiked,
    currentuser_id
) {
    try {
        // Create a query to find the artProject's Document
        const q = query(
            collection(db, "artProjects"),
            where("user_id", "==", user_id),
            where("project_createdAt", "==", createdAt)
        );

        const querySnapshot = await getDocs(q);
        const artProjectId = doc(db, "artProjects", querySnapshot.docs[0].id);

        if (isLiked) {
            // Update artProject's Document
            await updateDoc(artProjectId, {
                project_likesCount: increment(1),
                project_likedBy: arrayUnion(currentuser_id),
            });
        } else {
            // Update artProject's Document
            await updateDoc(artProjectId, {
                project_likesCount: increment(-1),
                project_likedBy: arrayRemove(currentuser_id),
            });
        }
    } catch (error) {
        console.error("Error updating like:", error);
    }
}
