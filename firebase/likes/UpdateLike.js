import {
    collection,
    doc,
    getDocs,
    updateDoc,
    increment,
    query,
    where,
    arrayUnion,
    arrayRemove,
} from "firebase/firestore";
import { db } from "../Config";

export default async function UpdateLike(uid, createdAt, isLiked, currentUser) {
    try {
        // Get user's Document
        const userDocId = doc(db, "users", currentUser);

        // Create a query to find the artProject's Document
        const q = query(
            collection(db, "artProjects"),
            where("user_id", "==", uid),
            where("project_createdAt", "==", createdAt)
        );
        const querySnapshot = await getDocs(q);
        const artProjectId = doc(db, "artProjects", querySnapshot.docs[0].id);

        if (isLiked) {
            // Update Users Collection
            await updateDoc(userDocId, {
                user_likedArtworks: arrayUnion(artProjectId.id),
            });

            // Update artProject's Document
            await updateDoc(artProjectId, {
                project_likesCount: increment(1),
                project_likedBy: arrayUnion(currentUser),
            });
        } else {
            // Update Users Collection
            await updateDoc(userDocId, {
                user_likedArtworks: arrayRemove(artProjectId.id),
            });

            // Update artProject's Document
            await updateDoc(artProjectId, {
                project_likesCount: increment(-1),
                project_likedBy: arrayRemove(currentUser),
            });
        }
    } catch (error) {
        console.error("Error updating like:", error);
    }
}
