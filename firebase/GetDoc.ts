import { doc, getDoc, DocumentData } from "firebase/firestore";
import { db } from "./Config";

export default async function GetDoc(
    collectionName: string,
    docId: string
): Promise<DocumentData | undefined> {
    try {
        const docRef = doc(db, collectionName, docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            return undefined;
        }
    } catch (error: unknown) {
        console.error("Error getting doc:", error);
        return undefined;
    }
}
