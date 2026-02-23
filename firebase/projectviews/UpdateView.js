import { arrayUnion, increment, updateDoc } from "firebase/firestore";
import { getArtworkDocRef } from "../../utils/firebaseUtils";

export default async function UpdateView(userId, createdAt, currentUser) {
    try {
        const { docRef, snapshot } = await getArtworkDocRef(userId, createdAt);

        // Initialize as an empty array if not present
        const viewedBy = snapshot.docs[0].data().project_viewedBy || [];

        // Only increment if this user hasn't viewed before
        if (!viewedBy.includes(currentUser.uid)) {
            await updateDoc(docRef, {
                project_viewsCount: increment(1),
                project_viewedBy: arrayUnion(currentUser.uid),
            });
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error updating view:", error);
    }
}
