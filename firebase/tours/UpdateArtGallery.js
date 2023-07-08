import { doc, updateDoc } from "firebase/firestore";
import { db } from "../Config";

export default async function UpdateArtGallery(tourData, slug) {
    let error = null;
    try {
        // Get Tour Reference
        const tourRef = doc(db, "virtualArtGalleries", slug);

        // Get the current date and time
        const currentDate = new Date();
        const timestamp = currentDate.toISOString();

        const updatedTourData = {
            ...tourData,
            tour_updatedAt: timestamp,
        };

        await updateDoc(tourRef, updatedTourData);
    } catch (e) {
        error = e;
        console.error("Error updating tour:", error);
    }

    return { error }
}