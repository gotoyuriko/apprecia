import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { db } from "../Config";

export default async function GetUser(email_id) {
    try {
        const q = query(collection(db, "users"), where("user_email", "==", email_id));
        const querySnapshot = await getDocs(q);
        const userData = [];
        if (querySnapshot.docs.length > 0) {
            const userDocId = doc(db, "users", querySnapshot.docs[0].id);
            querySnapshot.docs.forEach((doc) => { userData.push(doc.data()); });
            return { user: userData[0], userid: userDocId.id };
        } else {
            throw new Error("User not found");
        }
    } catch (error) {
        console.error('Error getting User', error);
    }
}
