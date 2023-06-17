import { db } from "./Config";
import { collection, doc, setDoc, query, where, getDocs } from "firebase/firestore";

export default async function AddUser(collectionName, userData) {
    let docRef = null;
    let error = null;

    try {
        // Check if the user already exists with the same email
        const usersCollection = collection(db, collectionName);
        const querySnapshot = await getDocs(
            query(usersCollection, where("user_email", "==", userData.email))
        );

        // If querySnapshot is not empty (user already exists with the same email)
        if (!querySnapshot.empty) {
            // User with the same email already exists
            error = "User with the same email already exists.";
        } else {
            // Use UID as the document ID
            docRef = doc(usersCollection, userData.uid);

            const user = {
                user_email: userData.email,
                user_name: userData.displayName,
                user_bio: "",
            };

            if (userData.photoURL) {
                user.user_photoURL = userData.photoURL;
            }

            // Set user data with the UID as the document ID
            await setDoc(docRef, user);
        }
    } catch (e) {
        error = e;
        console.error("Error adding user:", error);
    }

    return { docRef, error };
}
