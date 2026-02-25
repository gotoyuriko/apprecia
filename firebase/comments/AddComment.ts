import { arrayUnion, updateDoc } from "firebase/firestore";
import { getArtworkDocRef } from "../../utils/firebaseUtils";
import { getCurrentTimestamp } from "../../utils/dateUtils";
import type { Comment } from "@/types";

export default async function AddComment(
    creator: string,
    createdAt: string,
    commentData: Comment
): Promise<{ updatedCommentData: Comment } | undefined> {
    try {
        const { docRef } = await getArtworkDocRef(creator, createdAt);

        const updatedCommentData: Comment = {
            ...commentData,
            comment_createdAt: getCurrentTimestamp(),
        };

        await updateDoc(docRef, {
            project_comments: arrayUnion(updatedCommentData),
        });

        return { updatedCommentData };
    } catch (error: unknown) {
        console.error("error adding comments", error);
        return undefined;
    }
}
