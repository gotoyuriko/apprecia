import { collection, doc, setDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../Config";
import type { User } from "firebase/auth";

export default async function AddUser(userData: User): Promise<void> {
    let docRef = null;

    const user: {
        user_email: string | null;
        user_name: string | null;
        user_bio: string;
        user_photoURL?: string;
    } = {
        user_email: userData.email,
        user_name: userData.displayName,
        user_bio: "",
    };

    try {
        const usersCollection = collection(db, "users");
        const querySnapshot = await getDocs(
            query(usersCollection, where("user_email", "==", userData.email))
        );

        if (querySnapshot.empty) {
            docRef = doc(usersCollection, userData.uid);
        }

        if (userData.photoURL) {
            user.user_photoURL = userData.photoURL;
        }

        if (docRef !== null) {
            await setDoc(docRef, user);
        }
    } catch (error: unknown) {
        console.error("Error adding user:", error);
    }
}
