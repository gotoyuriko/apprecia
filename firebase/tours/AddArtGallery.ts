import { addDoc, collection } from "firebase/firestore";
import { db } from "../Config";
import type { ArtGallery } from "@/types";

export default async function AddArtGallery(
    tourData: Omit<ArtGallery, "tour_createdAt">
): Promise<{ error: unknown | null }> {
    let error: unknown | null = null;
    try {
        const timestamp = new Date().toISOString();

        const updatedTourData: ArtGallery = {
            ...tourData,
            tour_createdAt: timestamp,
        };

        await addDoc(collection(db, "virtualArtGalleries"), updatedTourData);
    } catch (e: unknown) {
        error = e;
        console.error("Error adding tour:", error);
    }

    return { error };
}
