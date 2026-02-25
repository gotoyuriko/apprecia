import { doc, updateDoc } from "firebase/firestore";
import { db } from "../Config";
import type { ArtGallery } from "@/types";

export default async function UpdateArtGallery(
    tourData: ArtGallery,
    slug: string
): Promise<{ error: unknown | null }> {
    let error: unknown | null = null;
    try {
        const tourRef = doc(db, "virtualArtGalleries", slug);

        const timestamp = new Date().toISOString();

        const updatedTourData: ArtGallery & { tour_updatedAt: string } = {
            ...tourData,
            tour_updatedAt: timestamp,
        };

        await updateDoc(tourRef, updatedTourData as unknown as Record<string, unknown>);
    } catch (e: unknown) {
        error = e;
        console.error("Error updating tour:", error);
    }

    return { error };
}
