import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../Config";

export default async function GetArtGalleries() {
    try {
        const galleryProjects = collection(db, "virtualArtGalleries");
        const q = query(galleryProjects, orderBy("tour_createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const galleryData = [];
        querySnapshot.forEach((doc) => {
            galleryData.push(doc.data());
        });
        return galleryData;
    } catch (error) {
        console.error("Error getting art gallery:", error);
    }
}