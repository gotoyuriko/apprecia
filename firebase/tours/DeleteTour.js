import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../Config";

export default async function DeleteTour(tourId) {
    try {
        await deleteDoc(doc(db, "virtualTours", tourId));
    } catch (error) {
        console.error('Error Deleting Tour', error);
    }
}