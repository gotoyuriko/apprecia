
import { collection, doc, setDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../Config";

export default async function AddUser(userData) {
    let docRef = null;

    const user = {
        user_email: userData.email,
        user_name: userData.displayName,
        user_bio: "",
    }

    try {
        // Check if the user already exists with the same email
        const usersCollection = collection(db, "users");
        const querySnapshot = await getDocs(
            query(usersCollection, where("user_email", "==", userData.email))
        );

        // If querySnapshot is empty (user does not exists with the same email)
        if (querySnapshot.empty) {
            // Use UID as the document ID
            docRef = doc(usersCollection, userData.uid);
        };

        if (userData.photoURL) {
            user.user_photoURL = userData.photoURL;
        }

        // Set user data with the UID as the document ID
        if (docRef !== null) {
            await setDoc(docRef, user);
        }
    }
    catch (error) {
        console.error("Error adding user:", error);
    }
}


