import {
    GoogleAuthProvider,
    User,
    UserCredential,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile
} from "firebase/auth";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { fiauth } from "../Config";
import type { AuthContextValue, AuthResult } from "@/types";

const AuthContext = createContext<AuthContextValue>(null!);

export function useAuth(): AuthContextValue {
    return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    async function signup(fullname: string, email: string, password: string): Promise<AuthResult> {
        let result: User | null = null;
        let error: string | null = null;
        try {
            const { user } = await createUserWithEmailAndPassword(fiauth, email, password);
            await updateProfile(user, { displayName: fullname });
            result = user;
        } catch (e: unknown) {
            const err = e as { code?: string };
            if (err.code === 'auth/email-already-in-use') {
                error = "Email is already in use. You may go to 'Sign In'";
            } else {
                error = String(e);
                console.error(error);
            }
        }
        return { result, error };
    }

    async function signin(email: string, password: string): Promise<AuthResult> {
        let result: UserCredential | null = null;
        let error: string | null = null;
        try {
            result = await signInWithEmailAndPassword(fiauth, email, password);
        } catch (e: unknown) {
            const err = e as { code?: string };
            if (err.code === "auth/user-not-found") {
                error = "User not found";
            } else if (err.code === "auth/wrong-password") {
                error = "Incorrect email or password";
            } else {
                error = "An error occurred during sign-in";
                console.error(e);
            }
        }
        return { result, error };
    }

    function signout(): Promise<void> {
        return signOut(fiauth);
    }

    async function googleAuthentication(): Promise<AuthResult> {
        let result: UserCredential | null = null;
        let error: string | null = null;
        const googleAuth = new GoogleAuthProvider();
        try {
            result = await signInWithPopup(fiauth, googleAuth);
        } catch (e: unknown) {
            const err = e as { code?: string };
            if (err.code === "auth/cancelled-popup-request") {
                error = "Google sign-in popup was cancelled by the user.";
            } else {
                console.error("An error occurred during Google sign-in:", error);
            }
        }
        return { result, error };
    }

    async function resetPassword(email: string): Promise<{ error: unknown | null }> {
        let error: unknown | null = null;
        try {
            await sendPasswordResetEmail(fiauth, email);
        } catch (e: unknown) {
            error = e;
            console.error("Error resetting password", e);
        }
        return { error };
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(fiauth, async (user) => {
            setCurrentUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const value: AuthContextValue = {
        currentUser,
        signin,
        signup,
        signout,
        googleAuthentication,
        resetPassword
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
