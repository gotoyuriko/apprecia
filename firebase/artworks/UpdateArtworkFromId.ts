import { doc, updateDoc } from "firebase/firestore";
import { db } from "../Config";
import { uploadToCloudinary } from "../../utils/cloudinaryUtils";
import type { ArtProject, SelectOption } from "@/types";

export default async function UpdateArtworkFromId(
    images: (File | string)[],
    artworkData: ArtProject,
    slug: string
): Promise<{ error: unknown | null }> {
    let error: unknown | null = null;
    try {
        const artworkRef = doc(db, "artProjects", slug);

        const timestamp = new Date().toISOString();

        const imageUrls: string[] = [];

        if (images.length > 0) {
            for (const image of images) {
                if (typeof image === "string") {
                    imageUrls.push(image);
                } else {
                    const downloadURL = await uploadToCloudinary(image);
                    imageUrls.push(downloadURL);
                }
            }
        }

        const updatedProjectData: ArtProject & { project_updatedAt: string } = {
            ...artworkData,
            project_updatedAt: timestamp,
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

        await updateDoc(artworkRef, updatedProjectData as unknown as Record<string, unknown>);
    } catch (e: unknown) {
        error = e;
        console.error("Error updating artwork:", error);
    }

    return { error };
}
