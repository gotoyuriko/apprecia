import { arrayUnion, collection, doc, getDocs, increment, query, updateDoc, where } from "firebase/firestore";
import { db } from "../Config";

export default async function UpdateView(userId, createdAt, currentUser) {
    try {
        // Create a query to find the artProject's Document
        const q = query(collection(db, 'artProjects'), where('project_creator', '==', userId), where('project_createdAt', '==', createdAt));
        const querySnapshot = await getDocs(q);
        const artProjectRef = doc(db, 'artProjects', querySnapshot.docs[0].id);

        // Retrieve the artProject data
        const artProjectData = querySnapshot.docs[0].data();
        // Initialize as an empty array if not present
        const viewedBy = artProjectData.project_viewedBy || [];

        // Check if the project has been viewed by the user
        if (!viewedBy.includes(currentUser.uid)) {
            // Update artProject's Document
            await updateDoc(artProjectRef, {
                project_viewsCount: increment(1),
                project_viewedBy: arrayUnion(currentUser.uid)
            });
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error updating view:", error);
    }
}
