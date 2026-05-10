import { doc, updateDoc } from "firebase/firestore";
import { db } from "../Config";
import { uploadToCloudinary } from "../../utils/cloudinaryUtils";
import type { AppUser } from "@/types";

interface UpdateUserFormData {
    fullname: string;
    bio: string;
    photoURL: string;
}

export default async function UpdateUser(
    formData: UpdateUserFormData,
    profileImage: File | string | null,
    uid: string,
    userData: AppUser
): Promise<void> {
    try {
        if (profileImage && profileImage instanceof File) {
            if (formData.photoURL !== profileImage.name) {
                formData.photoURL = await uploadToCloudinary(profileImage);
            }
        } else if (!profileImage) {
            if (formData.photoURL !== userData.user_photoURL) {
                formData.photoURL = "";
            }
        }

        const updatedUserData = {
            user_name: formData.fullname,
            user_bio: formData.bio,
            user_photoURL: formData.photoURL,
        };

        const userDocRef = doc(db, "users", uid);
        await updateDoc(userDocRef, updatedUserData);
    } catch (error: unknown) {
        console.error("Error updating user profile:", error);
    }
}
