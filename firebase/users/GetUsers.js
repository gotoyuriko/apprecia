import { collection, getDocs } from "firebase/firestore";
import { db } from "../Config";

export default async function GetUsers() {
    try {
        const usersCollection = collection(db, "users");
        const querySnapshot = await getDocs(usersCollection);
        const usersData = [];
        querySnapshot.forEach((doc) => {
            usersData.push(doc.data());
        });

        return usersData;
    } catch (error) {
        console.error('Error getting users', error);
    }
}
