import Loading from "@/components/Loading";
import { auth } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";

/**
 * To make the user data available throughout our app, 
 * we are going to use React Context API. 
 * */

// Create context is used to share authentication information across different parts of the application.
export const AuthContext = createContext();

// A custom hook "useAuthContext" to access to AuthContext
export const useAuthContext = () => useContext(AuthContext);

//To provide information of authentication
export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    //To monitor changes in the authentication state
    useEffect(() => {
        //Whenever the user's authentication state changes and receives a user object.
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
        //AuthContext.Provider is used to provide the user as the value
        <AuthContext.Provider value={{ user }}>
            {loading ? (<Loading />) : children}
        </AuthContext.Provider>
    )
};


