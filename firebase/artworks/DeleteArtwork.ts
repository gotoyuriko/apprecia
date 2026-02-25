import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    query,
    setDoc,
    where,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { db, storage } from "../Config";

export default async function DeleteArtwork(
    imageUrls: string[],
    artworkId: string,
    creatorId: string
): Promise<void> {
    try {
        for (const imageUrl of imageUrls) {
            const storageFilename = decodeURIComponent(
                imageUrl.substring(imageUrl.lastIndexOf("/") + 1)
            ).split("?")[0];
            await deleteObject(ref(storage, storageFilename));
        }

        const virtualArtGalleriesCollection = collection(db, "virtualArtGalleries");

        for (const imageUrl of imageUrls) {
            const querySnapshot = await getDocs(
                query(
                    virtualArtGalleriesCollection,
                    where("tour_user", "==", creatorId)
                )
            );

            querySnapshot.forEach((docSnapshot) => {
                const tourRef = doc(db, "virtualArtGalleries", docSnapshot.id);
                const tourData = docSnapshot.data();

                if (tourData) {
                    let found = false;
                    tourData.tour_room.forEach(
                        (room: { room_artwork: { src: string }[] }) => {
                            room.room_artwork.forEach((artwork, index) => {
                                if (artwork.src === imageUrl) {
                                    room.room_artwork[index].src = "";
                                    found = true;
                                }
                            });
                        }
                    );
                    if (!found) {
                        console.error("Art project document not found.");
                    }
                    setDoc(tourRef, tourData);
                } else {
                    console.error("tourData is undefined.");
                }
            });
        }

        await deleteDoc(doc(db, "artProjects", artworkId));
    } catch (error: unknown) {
        console.error("Error Deleting Artwork", error);
    }
}
