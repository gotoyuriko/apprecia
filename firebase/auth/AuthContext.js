import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile
} from "firebase/auth";
import { createContext, useContext, useState, useEffect } from "react";
import { fiauth } from "../Config";
import { GoogleAuthProvider } from "firebase/auth";

// /**
//  * To make the user data available throughout our app, 
//  * we are going to use React Context API. 
//  * */

//To provide authentication data throughout the application.
const AuthContext = createContext();

// Define a custom hook to use the authentication status AuthProvider components
export function useAuth() {
    return useContext(AuthContext);
}

// Create an "AuthProvider" component that provides authentication data to its children
export function AuthProvider({ children }) {
    // Declare state variables for the authenticated user and loading status
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Define a "signup" function that creates a new user with Firebase's "createUserWithEmailAndPassword" method
    async function signup(fullname, email, password) {
        let result = null;
        let error = null;
        try {
            const { user } = await createUserWithEmailAndPassword(fiauth, email, password);
            await updateProfile(user, { displayName: fullname });
            result = user;
        } catch (e) {
            if (e.code === 'auth/email-already-in-use') {
                error = "Email is already in use. You may go to 'Sign In'";
            } else {
                error = e;
                console.error(error);
            }
        }
        return { result, error };
    }


    async function signin(email, password) {
        let result = null;
        let error = null;

        try {
            result = await signInWithEmailAndPassword(fiauth, email, password);
        } catch (e) {
            if (e.code === "auth/user-not-found") {
                error = "User not found";
            } else if (e.code === "auth/wrong-password") {
                error = "Incorrect email or password";
            } else {
                error = "An error occurred during sign-in";
                console.error(e);
            }
        }
        return { result, error };
    }

    // Define a "signout" function that sign out with Firebase's "signOut" method
    function signout() {
        return signOut(fiauth);
    }

    // Google Authentication
    async function googleAuthentication() {
        let result = null;
        let error = null;

        // Asynchronous sign in with pop up
        const googleAuth = new GoogleAuthProvider();

        try {
            result = await signInWithPopup(fiauth, googleAuth);
        } catch (e) {
            if (e.code === "auth/cancelled-popup-request") {
                error = "Google sign-in popup was cancelled by the user.";
            } else if (e.code === "auth/account-exists-with-different-credential") {
                error = "An account with the same email address already exists.";
            } else {
                console.error("An error occurred during Google sign-in:", error);
            }
        }
        return { result, error };
    }

    useEffect(() => {
        // Call onAuthStateChanged with the Firebase auth object and a callback function that updates state when user signs in or out.
        const unsubscribe = onAuthStateChanged(fiauth, async user => {
            // Update currentUser state with the authenticated user object (or null if no user is signed in)
            setCurrentUser(user);
            // set loading state to false as the component has finished it's initial loading and can now be displayed
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        signin,
        signup,
        signout,
        googleAuthentication
    }

    return (
        <AuthContext.Provider value={value}>
            {/* If not loading, it returns children */}
            {!loading && children}
        </AuthContext.Provider>
    );
}
