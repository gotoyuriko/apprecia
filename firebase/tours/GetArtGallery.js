import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { db } from "../Config";

export default async function GetArtGallery(userId, createdAt) {
    try {
        // Create a query to find the artProject's Document
        const q = query(
            collection(db, "virtualArtGalleries"),
            where("tour_user", "==", userId),
            where("tour_createdAt", "==", createdAt)
        );
        const querySnapshot = await getDocs(q);
        const artGalleryData = [];
        if (querySnapshot.docs.length > 0) {
            const artGalleryId = doc(db, "virtualArtGalleries", querySnapshot.docs[0].id);
            querySnapshot.docs.forEach((doc) => { artGalleryData.push(doc.data()); });
            return { artgallery: artGalleryData[0], galleryId: artGalleryId.id };
        } else {
            throw new Error("Art Gallery not found");
        }
    } catch (error) {
        console.error("Error getting art gallery:", error);
    }
}
