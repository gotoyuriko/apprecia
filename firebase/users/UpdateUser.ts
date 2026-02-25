import { doc, updateDoc } from "firebase/firestore";
import { db, storage } from "../Config";
import { getDownloadURL, ref, uploadBytes, deleteObject } from "firebase/storage";
import { v4 as uuid } from "uuid";
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
                const imageRef = ref(storage, `userProfile/${profileImage.name + uuid()}`);
                await uploadBytes(imageRef, profileImage);
                const downloadURL = await getDownloadURL(imageRef);
                formData.photoURL = downloadURL;

                if (
                    userData &&
                    userData.user_photoURL &&
                    !userData.user_photoURL.startsWith("https://lh3.googleusercontent.com/")
                ) {
                    const previousPhotoRef = ref(storage, userData.user_photoURL);
                    await deleteObject(previousPhotoRef);
                }
            }
        } else if (!profileImage) {
            if (formData.photoURL !== userData.user_photoURL) {
                if (
                    userData &&
                    userData.user_photoURL &&
                    !userData.user_photoURL.startsWith("https://lh3.googleusercontent.com/")
                ) {
                    const previousPhotoRef = ref(storage, userData.user_photoURL);
                    await deleteObject(previousPhotoRef);
                }
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
