import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../Config";

export default async function GetArtwork() {
    try {
        const artProjects = collection(db, "artProjects");
        const q = query(artProjects, orderBy("project_createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const artworkData = [];
        querySnapshot.forEach((doc) => {
            artworkData.push(doc.data());
        });

        return artworkData;
    } catch (error) {
        console.error("Error getting artwork:", error);
    }
}
