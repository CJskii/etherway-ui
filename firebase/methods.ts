import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./config";

// Only allowed for a signed in admin
export const storeFile = async (file: File): Promise<string | undefined> => {
  try {
    const storageRef = ref(storage, `images/aidrop/${file.name}`);

    // images/airdrop/projectId/logo
    // images/airdrop/projectId/banner;

    // 'file' comes from the Blob or File API
    await uploadBytes(storageRef, file).then((snapshot) => {
      console.log("Uploaded a blob or file!");
    });

    const fileURL = await getDownloadURL(storageRef);
    console.log(fileURL);
    return fileURL;
  } catch (error) {
    console.log(error);
    return;
  }
};
