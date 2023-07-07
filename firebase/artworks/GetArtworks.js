import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../Config";

export default async function GetArtworks() {
    try {
        const artProjectsCollection = collection(db, "artProjects");
        const q = query(artProjectsCollection, orderBy("project_createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const artworksData = [];
        querySnapshot.forEach((doc) => {
            artworksData.push(doc.data());
        });

        return artworksData;
    } catch (error) {
        console.error("Error getting artwork:", error);
    }
}
