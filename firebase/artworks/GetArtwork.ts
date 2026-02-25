import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { db } from "../Config";
import type { ArtProject } from "@/types";

export default async function GetArtwork(
    creatorId: string,
    createdAt: string
): Promise<{ artwork: ArtProject; id: string } | undefined> {
    try {
        const q = query(
            collection(db, "artProjects"),
            where("project_creator", "==", creatorId),
            where("project_createdAt", "==", createdAt)
        );
        const querySnapshot = await getDocs(q);
        const artworkData: ArtProject[] = [];
        if (querySnapshot.docs.length > 0) {
            const artProjectId = doc(db, "artProjects", querySnapshot.docs[0].id);
            querySnapshot.docs.forEach((doc) => { artworkData.push(doc.data() as ArtProject); });
            return { artwork: artworkData[0], id: artProjectId.id };
        } else {
            throw new Error("Artwork not found");
        }
    } catch (error: unknown) {
        console.error("Error getting Artwork", error);
        return undefined;
    }
}
