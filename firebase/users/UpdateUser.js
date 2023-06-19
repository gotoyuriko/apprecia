import { doc, updateDoc } from "firebase/firestore";
import { db, storage } from "../Config";
import { getDownloadURL, ref, uploadBytes, deleteObject } from "firebase/storage";
import { v4 as uuid } from "uuid";

export default async function UpdateUser(formData, profileImage, uid, userData) {
    try {
        if (profileImage) {
            // Upload the new profile photo
            const imageRef = ref(storage, `userProfile/${profileImage.name + uuid()}`);
            await uploadBytes(imageRef, profileImage);
            const downloadURL = await getDownloadURL(imageRef);
            formData.photoURL = downloadURL;

            // Delete the previous photo if it exists
            if (userData && userData.user_photoURL && !userData.user_photoURL.startsWith("https://lh3.googleusercontent.com/")) {
                const previousPhotoRef = ref(storage, userData.user_photoURL);
                await deleteObject(previousPhotoRef);
            }
        } else {
            // Set the photoURL to an empty string if no photo is selected
            formData.photoURL = "";

            // Delete the previous photo if it exists
            if (userData && userData.user_photoURL && !userData.user_photoURL.startsWith("https://lh3.googleusercontent.com/")) {
                const previousPhotoRef = ref(storage, userData.user_photoURL);
                await deleteObject(previousPhotoRef);
            }
        }

        const updatedUserData = {
            user_name: formData.fullname,
            user_bio: formData.bio,
            user_photoURL: formData.photoURL,
        };

        // Update user document in Firebase Firestore
        const userDocRef = doc(db, "users", uid);
        await updateDoc(userDocRef, updatedUserData);
    } catch (error) {
        console.error("Error updating user profile:", error);
    }
}
