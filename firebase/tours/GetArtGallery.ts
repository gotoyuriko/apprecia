import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { db } from "../Config";
import type { ArtGallery } from "@/types";

export default async function GetArtGallery(
    userId: string,
    createdAt: string
): Promise<{ artgallery: ArtGallery; galleryId: string } | undefined> {
    try {
        const q = query(
            collection(db, "virtualArtGalleries"),
            where("tour_user", "==", userId),
            where("tour_createdAt", "==", createdAt)
        );
        const querySnapshot = await getDocs(q);
        const artGalleryData: ArtGallery[] = [];
        if (querySnapshot.docs.length > 0) {
            const artGalleryId = doc(db, "virtualArtGalleries", querySnapshot.docs[0].id);
            querySnapshot.docs.forEach((doc) => {
                artGalleryData.push(doc.data() as ArtGallery);
            });
            return { artgallery: artGalleryData[0], galleryId: artGalleryId.id };
        } else {
            throw new Error("Art Gallery not found");
        }
    } catch (error: unknown) {
        console.error("Error getting art gallery:", error);
        return undefined;
    }
}
