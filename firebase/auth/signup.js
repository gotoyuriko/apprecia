import firebase_app from "../config";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const auth = getAuth(firebase_app);

export default async function signUp(fullname, email, password) {
    let result = null;
    let error = null;
    try {
        // To sign in users.
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(user, { displayName: fullname });

        result = user;
    } catch (e) {
        error = e;
    }

    return { result, error };
}