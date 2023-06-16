import { db } from "./Config";
import { collection, query, where, getDocs } from "firebase/firestore";

export default async function GetUserArtwork(uid) {
    const artProjects = collection(db, "artProjects");

    const q = query(artProjects, where("uid", "==", uid));

    const querySnapshot = await getDocs(q);
    const artworkData = [];
    querySnapshot.forEach((doc) => {
        artworkData.push(doc.data());
    });

    return artworkData;
}