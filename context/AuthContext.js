import firebase_app from "@/firebase/config";
import { getAuth } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";

/**
 * To make the user data from the above method available throughout our app, 
 * we are going to use React Context API. 
 * */

const auth = getAuth(firebase_app);

export const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({
    children,
}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user }}>
            {loading ? <div>Loading...</div> : children}
        </AuthContext.Provider>
    )
};


