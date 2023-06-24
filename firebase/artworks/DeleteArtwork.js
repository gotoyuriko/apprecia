import { deleteDoc, doc } from "firebase/firestore";
import { db, storage } from "../Config";
import { deleteObject, ref } from "firebase/storage";

export default async function DeleteArtwork(imageUrls, artworkId) {
    try {
        //Delete Artwork from storage
        for (const imageUrl of imageUrls) {
            const imageFilename = imageUrl.split('%2F').pop().split('?')[0];
            await deleteObject(ref(storage, `projectArtwork/${imageFilename}`));
        }
        await deleteDoc(doc(db, "artProjects", artworkId));
    } catch (error) {
        console.error('Error Deleting Artwork', error);
    }
}