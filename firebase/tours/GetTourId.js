import {
    collection,
    doc,
    getDocs,
    query,
    where
} from "firebase/firestore";
import { db } from "../Config";

export default async function GetTourId(uid, createdAt) {
    try {
        // Create a query to find the artProject's Document
        const q = query(
            collection(db, "virtualTours"),
            where("user_id", "==", uid),
            where("tour_createdAt", "==", createdAt)
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.docs.length > 0) {
            const artGalleryId = doc(db, "virtualTours", querySnapshot.docs[0].id);
            return artGalleryId.id;
        } else {
            throw new Error("Gallery not found");
        }
    } catch (error) {
        console.error("Error getting gallery id:", error);
    }
}
