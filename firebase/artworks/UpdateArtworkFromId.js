import { doc, updateDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref } from "firebase/storage";
import { db, storage } from "../Config";

export default async function UpdateArtworkFromId(images, artworkData, slug) {
    let error = null;
    try {
        // Get Artwork Reference
        const artworkRef = doc(db, "artProjects", slug);

        // Get the current date and time
        const currentDate = new Date();
        const timestamp = currentDate.toISOString();

        // Get the existing imageUrls from artworkData
        const existingImageUrls = artworkData.project_imageUrls || [];
        // Store imageUrls as an array
        const imageUrls = [];
        // Check any new image is uploaded
        if (images.length > 0) {
            for (const image of images) {
                if (typeof image === 'string') {
                    imageUrls.push(image);
                } else {
                    const imageRef = ref(storage, `projectArtwork/${image.name + uuid()}`);
                    await uploadBytes(imageRef, image);
                    const downloadURL = await getDownloadURL(imageRef);
                    imageUrls.push(downloadURL);
                }
            }
        }

        // Delete images that are not included in the updated images
        const deletedImageUrls = existingImageUrls.filter((existingImageUrl) => !imageUrls.includes(existingImageUrl));
        for (const imageUrl of deletedImageUrls) {
            // Extract the image file name from URL
            const imageFilename = imageUrl.split('%2F').pop().split('?')[0];
            // Delete the image from storage
            await deleteObject(ref(storage, `projectArtwork/${imageFilename}`));
        }

        const updatedProjectData = {
            ...artworkData,
            project_updatedAt: timestamp,
            project_imageUrls: imageUrls,
        };

        // Filter out invalid keys in tags and skills arrays
        updatedProjectData.project_tags = updatedProjectData.project_tags.map(
            (tag) => ({
                label: tag.label.replace(/^__/i, ""),
                value: tag.value,
                color: tag.color ? tag.color : "#333333",
            })
        );

        updatedProjectData.project_skills = updatedProjectData.project_skills.map(
            (skill) => ({
                label: skill.label.replace(/^__/i, ""),
                value: skill.value,
                color: skill.color ? skill.color : "#333333",
            })
        );

        await updateDoc(artworkRef, updatedProjectData);
    } catch (e) {
        error = e;
        console.error("Error updating artwork:", error);
    }

    return { error };
}
