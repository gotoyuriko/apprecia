import { arrayUnion, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "../Config";

export default async function UpdateComment({ uid, createdAt, newcomment }) {
    try {
        // Get the current date and time
        const currentDate = new Date();
        const timestamp = currentDate.toISOString();

        // Create a query to find the art project's document
        const q = query(
            collection(db, "artProjects"),
            where("user_id", "==", uid),
            where("project_createdAt", "==", createdAt)
        );
        const querySnapshot = await getDocs(q);

        // Retrieve the artProject document reference
        const artProjectRef = doc(db, "artProjects", querySnapshot.docs[0].id);

        const updatedCommentData = {
            ...commentData,
            comment_updatedAt: timestamp,
            comment_content: newcomment
        };

        await updateDoc(artProjectRef, {
            project_comments: arrayUnion(updatedCommentData),
        });
    } catch (error) {
        console.error("error adding comments", error);
    }
}