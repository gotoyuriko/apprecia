import { arrayUnion, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "../Config";

export default async function AddComment(creator, createdAt, commentData) {
    try {
        // Get the current date and time
        const currentDate = new Date();
        const timestamp = currentDate.toISOString();

        // Create a query to find the art project's document
        const q = query(
            collection(db, "artProjects"),
            where("project_creator", "==", creator),
            where("project_createdAt", "==", createdAt)
        );
        const querySnapshot = await getDocs(q);

        // Retrieve the artProject document reference
        const artProjectRef = doc(db, "artProjects", querySnapshot.docs[0].id);

        const updatedCommentData = {
            ...commentData,
            comment_createdAt: timestamp,
        };

        await updateDoc(artProjectRef, {
            project_comments: arrayUnion(updatedCommentData),
        });

        return { updatedCommentData }
    } catch (error) {
        console.error("error adding comments", error);
    }
}
