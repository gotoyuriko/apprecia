import { deleteDoc, doc } from "firebase/firestore";
import { db, storage } from "../Config";
import { deleteObject, ref } from "firebase/storage";

export default async function DeleteArtwork(imageUrls, artworkId) {
    try {
        // Delete Artwork from storage
        for (const imageUrl of imageUrls) {
            const storageFilename = decodeURIComponent(imageUrl.substring(imageUrl.lastIndexOf('/') + 1)).split('?')[0];
            await deleteObject(ref(storage, storageFilename));
        }
        await deleteDoc(doc(db, "artProjects", artworkId));
    } catch (error) {
        console.error('Error Deleting Artwork', error);
    }
}
