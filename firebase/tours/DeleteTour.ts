import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../Config";

export default async function DeleteArtGallery(tourId: string): Promise<void> {
    try {
        await deleteDoc(doc(db, "virtualArtGalleries", tourId));
    } catch (error: unknown) {
        console.error("Error Deleting Tour", error);
    }
}
