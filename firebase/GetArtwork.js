import { db } from "./Config";
import { collection, query, orderBy, getDocs } from "firebase/firestore";

export default async function GetArtwork() {
    const artProjects = collection(db, "artProjects");

    const q = query(artProjects, orderBy("date", "desc"));

    const querySnapshot = await getDocs(q);
    const artworkData = [];
    querySnapshot.forEach((doc) => {
        artworkData.push(doc.data());
    });

    return artworkData;
}