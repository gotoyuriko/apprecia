import { db } from "./Config";
import { getDoc, doc } from "firebase/firestore";

export default async function GetUser(uid) {

    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        return;
    }
}