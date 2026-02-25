import { arrayUnion, increment, updateDoc } from "firebase/firestore";
import { getArtworkDocRef } from "../../utils/firebaseUtils";
import type { User } from "firebase/auth";

export default async function UpdateView(
    userId: string,
    createdAt: string,
    currentUser: User
): Promise<boolean | undefined> {
    try {
        const { docRef, snapshot } = await getArtworkDocRef(userId, createdAt);

        const viewedBy: string[] = snapshot.docs[0].data().project_viewedBy || [];

        if (!viewedBy.includes(currentUser.uid)) {
            await updateDoc(docRef, {
                project_viewsCount: increment(1),
                project_viewedBy: arrayUnion(currentUser.uid),
            });
            return true;
        }
        return false;
    } catch (error: unknown) {
        console.error("Error updating view:", error);
        return undefined;
    }
}
