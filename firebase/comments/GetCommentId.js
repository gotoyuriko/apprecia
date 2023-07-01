import {
    collection,
    doc,
    getDocs,
    query,
    where
} from "firebase/firestore";
import { db } from "../Config";

export default async function GetCommentId(uid, createdAt) {
    try {
        // Create a query to find the artProject's Document
        const q = query(
            collection(db, "artProjects"),
            where("user_id", "==", uid),
            where("project_createdAt", "==", createdAt)
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.docs.length > 0) {
            const artProjectId = doc(db, "artProjects", querySnapshot.docs[0].id);
            return artProjectId.id;
        } else {
            throw new Error("Comments not found");
        }
    } catch (error) {
        console.error("Error getting comment id:", error);
    }
}
