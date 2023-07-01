import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../Config";

export default async function GetComments(uid, createdAt) {
    const artProjects = collection(db, "artProjects");
    const q = query(
        artProjects,
        where("user_id", "==", uid),
        where("project_createdAt", "==", createdAt),
        orderBy("project_createdAt")
    );

    const querySnapshot = await getDocs(q);
    const commentData = [];
    querySnapshot.forEach((doc) => {
        const projectComments = doc.data().project_comments || [];
        commentData.push(...projectComments);
    });

    return commentData;
}
