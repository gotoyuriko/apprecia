import firebase_app from "../config";
import { getAuth, createUserWithEmailAndPassword, signInWithCustomToken, signInWithEmailAndPassword } from "firebase/auth";

const auth = getAuth(firebase_app);

export default async function signIp(email, password) {
    let result = null;
    let error = null;
    try {
        // To sign up new users.
        result = await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
        error = e;
    }

    return { result, error };
}