import { doc, getDoc } from "firebase/firestore";
import { db } from "../Config";

export default async function GetUser(uid) {
    try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            return;
        }
    } catch (error) {
        console.error('Error Getting User', error);
    }
}
