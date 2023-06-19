import { collection, doc, getDocs, updateDoc, arrayUnion, arrayRemove, increment, query, where } from "firebase/firestore";
import { db } from "../Config";

export default async function UpdateLike(uid, createdAt, isLiked) {
    // Get user's Document
    const userDocRef = doc(db, 'users', uid);

    // Create a query to find the artProject's Document
    const q = query(collection(db, 'artProjects'), where('user_id', '==', uid), where('project_createdAt', '==', createdAt));
    const querySnapshot = await getDocs(q);
    const artProjectRef = doc(db, 'artProjects', querySnapshot.docs[0].id);

    try {
        if (isLiked) {
            // Update Users Collection
            await updateDoc(userDocRef, {
                user_likedArtworks: arrayUnion(artProjectRef)
            });

            // Update artProject's Document
            await updateDoc(artProjectRef, {
                project_likesCount: increment(1),
                project_likedBy: arrayUnion(uid)
            });
        } else {
            // Update Users Collection
            await updateDoc(userDocRef, {
                user_likedArtworks: arrayRemove(artProjectRef)
            });

            // Update artProject's Document
            await updateDoc(artProjectRef, {
                project_likesCount: increment(-1),
                project_likedBy: arrayRemove(uid)
            });
        }
    } catch (error) {
        console.error("Error updating like:", error);
    }
}
