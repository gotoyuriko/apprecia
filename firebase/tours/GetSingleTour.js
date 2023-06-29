import { db } from "../Config";
import { getDoc, doc } from "firebase/firestore";

export default async function GetSingleTour(projectID) {
    const docRef = doc(db, "virtualTours", projectID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        return;
    }
}