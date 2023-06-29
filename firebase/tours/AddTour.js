import { addDoc, collection } from "firebase/firestore";
import { db } from "../Config";

export default async function AddTour(tourData) {
    let docRef = null;
    let error = null;
    try {
        // Get the current date and time
        const currentDate = new Date();
        const timestamp = currentDate.toISOString();

        const updatedTourData = {
            ...tourData,
            tour_createdAt: timestamp
        }
        docRef = await addDoc(collection(db, "virtualTours"), updatedTourData);
    } catch (e) {
        error = e;
        console.error("Error adding tour:", error);
    }

    return { error };
}