import { arrayUnion, updateDoc } from "firebase/firestore";
import { getArtworkDocRef } from "../../utils/firebaseUtils";
import { getCurrentTimestamp } from "../../utils/dateUtils";

export default async function AddComment(creator, createdAt, commentData) {
    try {
        const { docRef } = await getArtworkDocRef(creator, createdAt);

        const updatedCommentData = {
            ...commentData,
            comment_createdAt: getCurrentTimestamp(),
        };

        await updateDoc(docRef, {
            project_comments: arrayUnion(updatedCommentData),
        });

        return { updatedCommentData };
    } catch (error) {
        console.error("error adding comments", error);
    }
}
