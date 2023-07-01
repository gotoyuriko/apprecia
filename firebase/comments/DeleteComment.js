import { deleteDoc } from "firebase/firestore";
import { db } from "../Config";

export default async function DeleteComment(commentId) {
    try {
        await deleteDoc(doc(db, "artProjects", commentId));
    } catch (error) {
        console.error('Error Deleting Artwork', error);
    }
}
