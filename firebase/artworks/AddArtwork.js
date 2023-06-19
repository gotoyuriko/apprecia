import { db, storage } from '../Config';
import { addDoc, collection } from 'firebase/firestore';
import { v4 as uuid } from 'uuid';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default async function AddArtwork(images, projectData) {
    let docRef = null;
    let error = null;
    try {
        // Get the current date and time
        const currentDate = new Date();
        const timestamp = currentDate.toISOString();

        // Store imageUrls as an array
        const imageUrls = [];

        for (const image of images) {
            const imageRef = ref(storage, `projectArtwork/${image.name + uuid()}`);
            await uploadBytes(imageRef, image);
            const downloadURL = await getDownloadURL(imageRef);
            imageUrls.push(downloadURL);
        }

        const updatedProjectData = {
            ...projectData,
            project_createdAt: timestamp,
            project_imageUrls: imageUrls
        };

        // Filter out invalid keys in tags and skills arrays
        updatedProjectData.project_tags = updatedProjectData.project_tags
            .map(tag => ({
                label: tag.label.replace(/^__/i, ''),
                value: tag.value,
                color: tag.color,
            }));

        updatedProjectData.project_skills = updatedProjectData.project_skills
            .map(skill => ({
                label: skill.label.replace(/^__/i, ''),
                value: skill.value,
                color: skill.color ? skill.color : '#333333',
            }));

        docRef = await addDoc(collection(db, 'artProjects'), updatedProjectData);
    } catch (e) {
        error = e;
        console.error('Error adding artwork:', error);
    }

    return { docRef, error };
}
