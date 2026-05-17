import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  collection, 
  addDoc,
  getDocs,
  query,
  QueryConstraint,
  DocumentData,
  WithFieldValue,
  UpdateData
} from "firebase/firestore";
import { db } from "./config";

import { ClauseAnalysisResult } from '../analysis/formatter';

// --- ARCHITECTURE & SCHEMAS ---

export type ContractStatus = 'uploaded' | 'parsing' | 'chunked' | 'ready_for_analysis' | 'analyzing' | 'analyzed' | 'analysis_failed' | 'failed';

export interface ContractClause {
  id: string;
  position: number;
  text: string;
  analysis?: ClauseAnalysisResult;
}

export interface UserDocument {
  email: string;
  displayName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContractDocument {
  userId: string;
  fileName: string;
  status: ContractStatus;
  createdAt: Date;
  updatedAt: Date;
  extractedText?: string; // No raw files are stored permanently
  fileHash?: string;
  clauses?: ContractClause[];
}

export interface AnalysisDocument {
  contractId: string;
  userId: string;
  aiSummary: string;
  flags: string[];
  createdAt: Date;
}

export interface ProofDocument {
  contractId: string;
  nfcSignature?: string;
  zkProof?: string;
  verifiedAt: Date;
}

export const COLLECTIONS = {
  USERS: 'users',
  CONTRACTS: 'contracts',
  ANALYSES: 'analyses',
  PROOFS: 'proofs',
} as const;

// --- DATABASE HELPERS ---

// Generic add document wrapper
export const addDocument = async <T extends WithFieldValue<DocumentData>>(
  collectionPath: string, 
  data: T
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, collectionPath), {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error(`Error adding document to ${collectionPath}:`, error);
    throw error;
  }
};

// Set document wrapper (ideal for specific IDs like userId)
export const setDocument = async <T extends WithFieldValue<DocumentData>>(
  collectionPath: string, 
  docId: string, 
  data: T, 
  merge = true
): Promise<string> => {
  try {
    await setDoc(doc(db, collectionPath, docId), {
      ...data,
      updatedAt: new Date(),
    }, { merge });
    return docId;
  } catch (error) {
    console.error(`Error setting document in ${collectionPath}/${docId}:`, error);
    throw error;
  }
};

// Get document wrapper
export const getDocument = async <T = DocumentData>(
  collectionPath: string, 
  docId: string
): Promise<(T & { id: string }) | null> => {
  try {
    const docSnap = await getDoc(doc(db, collectionPath, docId));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...(docSnap.data() as T) };
    }
    return null;
  } catch (error) {
    console.error(`Error getting document ${collectionPath}/${docId}:`, error);
    throw error;
  }
};

// Update document wrapper
export const updateDocument = async <T extends UpdateData<DocumentData>>(
  collectionPath: string, 
  docId: string, 
  data: T
): Promise<void> => {
  try {
    const docRef = doc(db, collectionPath, docId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error(`Error updating document ${collectionPath}/${docId}:`, error);
    throw error;
  }
};

// Delete document wrapper
export const deleteDocument = async (collectionPath: string, docId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, collectionPath, docId));
  } catch (error) {
    console.error(`Error deleting document ${collectionPath}/${docId}:`, error);
    throw error;
  }
};

// Query collection wrapper
export const getCollection = async <T = DocumentData>(
  collectionPath: string, 
  ...queryConstraints: QueryConstraint[]
): Promise<((T & { id: string })[])> => {
  try {
    const q = query(collection(db, collectionPath), ...queryConstraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...(docSnap.data() as T)
    }));
  } catch (error) {
    console.error(`Error fetching collection ${collectionPath}:`, error);
    throw error;
  }
};
