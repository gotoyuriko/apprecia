import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../Config";

export default async function GetTour() {
    const galleryProjects = collection(db, "virtualTours");

    const q = query(galleryProjects, orderBy("tour_createdAt", "desc"));

    const querySnapshot = await getDocs(q);
    const galleryData = [];
    querySnapshot.forEach((doc) => {
        galleryData.push(doc.data());
    });

    return galleryData;
}