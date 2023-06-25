import { doc, updateDoc } from "firebase/firestore";
import { db, storage } from "../Config";
import { getDownloadURL, ref, uploadBytes, deleteObject } from "firebase/storage";
import { v4 as uuid } from "uuid";

export default async function UpdateUser(formData, profileImage, uid, userData) {
    try {
        // Check if a new profile image is selected
        if (profileImage) {
            // Check if the selected profile image is different from the existing photo
            if (formData.photoURL !== profileImage) {
                // Upload the new profile photo to Firebase Storage
                const imageRef = ref(storage, `userProfile/${profileImage.name + uuid()}`);
                await uploadBytes(imageRef, profileImage);
                const downloadURL = await getDownloadURL(imageRef);
                formData.photoURL = downloadURL;

                // Delete the previous photo if it exists and is not a default Google photo
                if (userData && userData.user_photoURL && !userData.user_photoURL.startsWith("https://lh3.googleusercontent.com/")) {
                    const previousPhotoRef = ref(storage, userData.user_photoURL);
                    await deleteObject(previousPhotoRef);
                }
            }
        } else if (!profileImage) {
            // If no new profile image is selected, check if the existing photo should be deleted
            if (formData.photoURL !== userData.user_photoURL) {
                // Delete the previous photo if it exists and is not a default Google photo
                if (userData && userData.user_photoURL && !userData.user_photoURL.startsWith("https://lh3.googleusercontent.com/")) {
                    const previousPhotoRef = ref(storage, userData.user_photoURL);
                    await deleteObject(previousPhotoRef);
                }
                // Set the photoURL to an empty string
                formData.photoURL = "";
            }
        }

        // Create the updated user data object
        const updatedUserData = {
            user_name: formData.fullname,
            user_bio: formData.bio,
            user_photoURL: formData.photoURL,
        };

        // Update the user document in Firebase Firestore
        const userDocRef = doc(db, "users", uid);
        await updateDoc(userDocRef, updatedUserData);
    } catch (error) {
        console.error("Error updating user profile:", error);
    }
}
