import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../Config";
import type { ArtGallery } from "@/types";

export default async function GetArtGalleries(): Promise<ArtGallery[]> {
    try {
        const galleryProjects = collection(db, "virtualArtGalleries");
        const q = query(galleryProjects, orderBy("tour_createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const galleryData: ArtGallery[] = [];
        querySnapshot.forEach((doc) => {
            galleryData.push(doc.data() as ArtGallery);
        });
        return galleryData;
    } catch (error: unknown) {
        console.error("Error getting art gallery:", error);
        return [];
    }
}
