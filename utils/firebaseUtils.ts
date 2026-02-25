import {
    collection,
    doc,
    getDocs,
    query,
    where,
    DocumentReference,
    QuerySnapshot,
    DocumentData,
} from "firebase/firestore";
import { db } from "../firebase/Config";

// Firestore collection names
export const COLLECTIONS = {
    ART_PROJECTS: "artProjects",
    USERS: "users",
    ART_GALLERIES: "artGalleries",
} as const;

/**
 * Returns a Firestore document reference for an artwork identified
 * by its creator email and creation timestamp.
 *
 * Multiple Firebase operations (UpdateLike, UpdateView, AddComment)
 * all repeat this same two-field query pattern; centralising it here
 * removes duplication and gives a single place to update if the schema
 * ever changes.
 *
 * @param creator   - project_creator field value (user email)
 * @param createdAt - project_createdAt field value (ISO timestamp)
 * @returns { docRef, snapshot }
 */
export async function getArtworkDocRef(
    creator: string,
    createdAt: string
): Promise<{ docRef: DocumentReference<DocumentData>; snapshot: QuerySnapshot<DocumentData> }> {
    const q = query(
        collection(db, COLLECTIONS.ART_PROJECTS),
        where("project_creator", "==", creator),
        where("project_createdAt", "==", createdAt)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
        throw new Error(`Artwork not found for creator="${creator}" createdAt="${createdAt}"`);
    }
    const docRef = doc(db, COLLECTIONS.ART_PROJECTS, querySnapshot.docs[0].id);
    return { docRef, snapshot: querySnapshot };
}
