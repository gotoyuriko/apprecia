import { arrayRemove, arrayUnion, increment, updateDoc } from "firebase/firestore";
import { getArtworkDocRef } from "../../utils/firebaseUtils";

export default async function UpdateLike(creator, createdAt, isLiked, currentuser_id) {
    try {
        const { docRef } = await getArtworkDocRef(creator, createdAt);

        await updateDoc(docRef, {
            project_likesCount: increment(isLiked ? 1 : -1),
            project_likedBy: isLiked
                ? arrayUnion(currentuser_id)
                : arrayRemove(currentuser_id),
        });
    } catch (error) {
        console.error("Error updating like:", error);
    }
}
