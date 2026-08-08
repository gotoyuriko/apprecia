import { doc, updateDoc } from "firebase/firestore";
import { db } from "../Config";
import { uploadToCloudinary } from "../../utils/cloudinaryUtils";
import type { AppUser } from "@/types";

export interface UpdateUserFormData {
    fullname: string;
    bio: string;
    photoURL: string;
}

export interface UpdatedUserFields {
    user_name: string;
    user_bio: string;
    user_photoURL: string;
}

/**
 * Writes the profile fields to Firestore and returns exactly what was written.
 *
 * Rejects if the Cloudinary upload or the Firestore write fails — callers must
 * handle that, since anything they show the user before it resolves (an
 * optimistic name, a blob: preview URL) was never persisted.
 */
export default async function UpdateUser(
    formData: UpdateUserFormData,
    profileImage: File | string | null,
    uid: string,
    userData: AppUser
): Promise<UpdatedUserFields> {
    let photoURL = formData.photoURL;

    if (profileImage instanceof File) {
        if (formData.photoURL !== profileImage.name) {
            photoURL = await uploadToCloudinary(profileImage);
        }
    } else if (!profileImage) {
        if (formData.photoURL !== userData.user_photoURL) {
            photoURL = "";
        }
    }

    // Left un-annotated so updateDoc still sees the literal's inferred type.
    const updatedUserData = {
        user_name: formData.fullname,
        user_bio: formData.bio,
        user_photoURL: photoURL,
    };

    const userDocRef = doc(db, "users", uid);
    await updateDoc(userDocRef, updatedUserData);

    return updatedUserData;
}
