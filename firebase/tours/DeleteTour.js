import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../Config";

export default async function DeleteArtGallery(tourId) {
    try {
        await deleteDoc(doc(db, "virtualArtGalleries", tourId));
    } catch (error) {
        console.error('Error Deleting Tour', error);
    }
}