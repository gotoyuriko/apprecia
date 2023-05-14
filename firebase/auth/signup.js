import firebase_app from "../config";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const auth = getAuth(firebase_app);

export default async function signUp(fullname, email, password) {
    let result = null;
    let error = null;
    try {
        // To sign in users.
        result = await createUserWithEmailAndPassword(auth, fullname, email, password);
    } catch (e) {
        error = e;
    }

    return { result, error };
}