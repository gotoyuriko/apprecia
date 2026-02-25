import { collection, getDocs } from "firebase/firestore";
import { db } from "../Config";
import type { AppUser } from "@/types";

export default async function GetUsers(): Promise<AppUser[]> {
    try {
        const usersCollection = collection(db, "users");
        const querySnapshot = await getDocs(usersCollection);
        const usersData: AppUser[] = [];
        querySnapshot.forEach((doc) => {
            usersData.push(doc.data() as AppUser);
        });
        return usersData;
    } catch (error: unknown) {
        console.error("Error getting users", error);
        return [];
    }
}
