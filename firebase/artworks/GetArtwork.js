import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { db } from "../Config";

export default async function GetArtwork(creatorId, createdAt) {
    try {
        // Create a query to find the artProject's Document
        const q = query(
            collection(db, "artProjects"),
            where("project_creator", "==", creatorId),
            where("project_createdAt", "==", createdAt)
        );
        const querySnapshot = await getDocs(q);
        const artworkData = [];
        if (querySnapshot.docs.length > 0) {
            const artProjectId = doc(db, "artProjects", querySnapshot.docs[0].id);
            querySnapshot.docs.forEach((doc) => { artworkData.push(doc.data()); });
            return { artwork: artworkData[0], id: artProjectId.id };
        } else {
            throw new Error("Artwork not found");
        }
    } catch (error) {
        console.error("Error getting Artwork", error);
    }
}
