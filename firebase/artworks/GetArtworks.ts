import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../Config";
import type { ArtProject } from "@/types";

export default async function GetArtworks(): Promise<ArtProject[]> {
    try {
        const artProjectsCollection = collection(db, "artProjects");
        const q = query(artProjectsCollection, orderBy("project_createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const artworksData: ArtProject[] = [];
        querySnapshot.forEach((doc) => {
            artworksData.push(doc.data() as ArtProject);
        });
        return artworksData;
    } catch (error: unknown) {
        console.error("Error getting artwork:", error);
        return [];
    }
}
