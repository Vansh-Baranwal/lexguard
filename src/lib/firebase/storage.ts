import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from "firebase/storage";
import { storage } from "./config";

/**
 * Uploads a file to Firebase Storage
 * @param path The storage path (e.g., 'profiles/userId.png' or 'documents/docId.pdf')
 * @param file The File object to upload
 */
export const uploadFile = async (path: string, file: File): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error(`Error uploading file to ${path}:`, error);
    throw error;
  }
};

/**
 * Deletes a file from Firebase Storage
 * @param path The storage path of the file
 */
export const deleteFile = async (path: string): Promise<void> => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error(`Error deleting file from ${path}:`, error);
    throw error;
  }
};
