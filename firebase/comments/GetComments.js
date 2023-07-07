import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../Config";

export default async function GetComments(userId, createdAt) {
    try {
        const artProjects = collection(db, "artProjects");
        const q = query(
            artProjects,
            where("project_creator", "==", userId),
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
    } catch (error) {
        console.error("Error getting comments", error);
    }
}
