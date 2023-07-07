import { doc, getDoc } from "firebase/firestore";
import { db } from "./Config";

export default async function GetDoc(collectionName, docId) {
    try {
        const docRef = doc(db, collectionName, docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            return;
        }
    } catch (error) {
        console.error("Error getting doc:", error);
    }
}