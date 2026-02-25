import { db, storage } from "../Config";
import { addDoc, collection } from "firebase/firestore";
import { v4 as uuid } from "uuid";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getCurrentTimestamp } from "../../utils/dateUtils";
import { COLLECTIONS } from "../../utils/firebaseUtils";
import type { ArtProject, SelectOption } from "@/types";

export default async function AddArtwork(
    images: File[],
    projectData: Omit<ArtProject, "project_createdAt" | "project_imageUrls">
): Promise<{ error: unknown | null }> {
    let error: unknown | null = null;
    try {
        const timestamp = getCurrentTimestamp();
        const imageUrls: string[] = [];

        for (const image of images) {
            const imageRef = ref(storage, `projectArtwork/${image.name + uuid()}`);
            await uploadBytes(imageRef, image);
            const downloadURL = await getDownloadURL(imageRef);
            imageUrls.push(downloadURL);
        }

        const updatedProjectData: ArtProject = {
            ...projectData,
            project_createdAt: timestamp,
            project_imageUrls: imageUrls,
        };

        updatedProjectData.project_tags = updatedProjectData.project_tags.map(
            (tag: SelectOption) => ({
                label: tag.label.replace(/^__/i, ""),
                value: tag.value,
                color: tag.color ? tag.color : "#333333",
            })
        );

        updatedProjectData.project_skills = updatedProjectData.project_skills.map(
            (skill: SelectOption) => ({
                label: skill.label.replace(/^__/i, ""),
                value: skill.value,
                color: skill.color ? skill.color : "#333333",
            })
        );

        await addDoc(collection(db, COLLECTIONS.ART_PROJECTS), updatedProjectData);
    } catch (e: unknown) {
        error = e;
        console.error("Error adding artwork:", error);
    }

    return { error };
}
