import { db } from "../Config";
import { collection, getDocs } from "firebase/firestore";

export default async function GetUsers() {
    const usersCollection = collection(db, "users");
    const querySnapshot = await getDocs(usersCollection);
    const userData = [];
    querySnapshot.forEach((doc) => {
        userData.push(doc.data());
    });

    return userData;
}
