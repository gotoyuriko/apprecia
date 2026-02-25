import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../Config";
import type { Comment } from "@/types";

export default async function GetComments(
    userId: string,
    createdAt: string
): Promise<Comment[]> {
    try {
        const artProjects = collection(db, "artProjects");
        const q = query(
            artProjects,
            where("project_creator", "==", userId),
            where("project_createdAt", "==", createdAt),
            orderBy("project_createdAt")
        );

        const querySnapshot = await getDocs(q);
        const commentData: Comment[] = [];
        querySnapshot.forEach((doc) => {
            const projectComments: Comment[] = doc.data().project_comments || [];
            commentData.push(...projectComments);
        });

        return commentData;
    } catch (error: unknown) {
        console.error("Error getting comments", error);
        return [];
    }
}
