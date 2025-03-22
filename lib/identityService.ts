import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  deleteDoc,
  serverTimestamp,
  updateDoc,
  writeBatch
} from 'firebase/firestore';

import { db } from './firebase';
import { Identity, generateIdentity, DocumentType, SocialMediaPlatform } from './identityGenerator';

const COLLECTION_NAME = 'identities';
const DEMO_MODE = !process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY === '';
const STORAGE_KEY = 'metchera_identities';

// Helper function to generate a UUID for browsers that don't support crypto.randomUUID()
function generateUUID(): string {
  // Check if crypto.randomUUID is available
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  
  // Fallback implementation for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Interface for Firestore data structure
interface FirestoreIdentity {
  firstName: string;
  lastName: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  age: number;
  nationality: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  email: string;
  phone: string;
  avatarUrl: string;
  createdAt: Timestamp;
  expiresAt: Timestamp;
  autodelete: {
    enabled: boolean;
    deleteAt: Timestamp;
    timeoutMinutes: number;
  };
  documentType?: DocumentType;
  documents: {
    idcard?: any;
    passport?: any;
    driverlicense?: any;
  };
  socialMedia: Record<string, any>;
  tempEmail: {
    address: string;
    accessUrl: string;
    password?: string;
    provider: string;
  };
  banking: {
    bankName: string;
    accountNumber: string;
    routingNumber: string;
    accountType: 'checking' | 'savings';
    balance: number;
    currency: string;
    creditCard?: {
      number: string;
      expiryDate: string;
      cvv: string;
      type: 'visa' | 'mastercard' | 'amex' | 'discover';
    };
  };
}

// Demo mode functions using localStorage
const demoStorage = {
  getIdentities: (): Identity[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },
  saveIdentities: (identities: Identity[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(identities));
  },
  addIdentity: (identity: Identity): string => {
    const identities = demoStorage.getIdentities();
    identities.unshift(identity);
    demoStorage.saveIdentities(identities);
    return identity.id;
  },
  removeIdentity: (id: string): void => {
    const identities = demoStorage.getIdentities();
    const filtered = identities.filter(identity => identity.id !== id);
    demoStorage.saveIdentities(filtered);
  },
  getIdentityById: (id: string): Identity | null => {
    const identities = demoStorage.getIdentities();
    return identities.find(identity => identity.id === id) || null;
  }
};

/**
 * Save an identity to Firestore or localStorage in demo mode
 */
export async function saveIdentity(identity: Omit<Identity, 'id'>): Promise<string> {
  try {
    if (DEMO_MODE) {
      const fullIdentity = { ...identity, id: generateUUID() };
      return demoStorage.addIdentity(fullIdentity as Identity);
    }

    // Clean up the identity object for Firestore
    // Convert undefined values to null and prepare Firestore-compatible data
    const cleanedIdentity = {
      ...identity,
      documents: {
        // Only include document types that exist
        ...(identity.documents.idcard && { idcard: identity.documents.idcard }),
        ...(identity.documents.passport && { passport: identity.documents.passport }),
        ...(identity.documents.driverlicense && { driverlicense: identity.documents.driverlicense }),
      },
      // Convert social media join dates to Timestamps
      socialMedia: Object.entries(identity.socialMedia).reduce((acc, [platform, profile]) => {
        if (profile) {
          acc[platform as SocialMediaPlatform] = {
            ...profile,
            joinDate: Timestamp.fromDate(profile.joinDate)
          };
        }
        return acc;
      }, {} as FirestoreIdentity['socialMedia']),
      tempEmail: identity.tempEmail,
      banking: identity.banking,
      createdAt: serverTimestamp(),
      expiresAt: Timestamp.fromDate(identity.expiresAt),
      autodelete: {
        enabled: identity.autodelete.enabled,
        deleteAt: Timestamp.fromDate(identity.autodelete.deleteAt),
        timeoutMinutes: identity.autodelete.timeoutMinutes
      }
    };

    // If a document type has no documents, ensure the object exists but is empty
    if (Object.keys(cleanedIdentity.documents).length === 0) {
      cleanedIdentity.documents = {};
    }

    const docRef = await addDoc(collection(db, COLLECTION_NAME), cleanedIdentity);
    return docRef.id;
  } catch (error) {
    console.error('Error saving identity:', error);
    throw error;
  }
}

/**
 * Generate and save a new identity
 */
export async function generateAndSaveIdentity(documentType?: DocumentType, autoDeleteMinutes?: number): Promise<Identity> {
  const identity = generateIdentity(documentType, autoDeleteMinutes);
  if (DEMO_MODE) {
    demoStorage.addIdentity(identity);
    return identity;
  }
  
  const id = await saveIdentity(identity);
  return {
    ...identity,
    id
  };
}

/**
 * Get an identity by ID
 */
export async function getIdentityById(id: string): Promise<Identity | null> {
  try {
    if (DEMO_MODE) {
      return demoStorage.getIdentityById(id);
    }
    
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as FirestoreIdentity;
      
      // Ensure documents object is properly initialized
      const documents = data.documents || {};
      
      // Convert social media join dates back to Date objects
      const socialMedia = Object.entries(data.socialMedia || {}).reduce((acc, [platform, profile]) => {
        if (profile) {
          acc[platform as SocialMediaPlatform] = {
            ...profile,
            joinDate: profile.joinDate instanceof Timestamp ? profile.joinDate.toDate() : profile.joinDate
          };
        }
        return acc;
      }, {} as Identity['socialMedia']);
      
      return {
        ...data,
        id: docSnap.id,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
        expiresAt: data.expiresAt instanceof Timestamp ? data.expiresAt.toDate() : new Date(),
        autodelete: {
          enabled: data.autodelete?.enabled || false,
          deleteAt: data.autodelete?.deleteAt instanceof Timestamp ? data.autodelete.deleteAt.toDate() : new Date(Date.now() + 24 * 60 * 60000),
          timeoutMinutes: data.autodelete?.timeoutMinutes || 24 * 60
        },
        documents: {
          idcard: documents.idcard || undefined,
          passport: documents.passport || undefined,
          driverlicense: documents.driverlicense || undefined
        },
        socialMedia,
        tempEmail: data.tempEmail || {
          address: '',
          accessUrl: '',
          provider: '',
        },
        banking: data.banking || {
          bankName: '',
          accountNumber: '',
          routingNumber: '',
          accountType: 'checking',
          balance: 0,
          currency: '',
        }
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting identity:', error);
    throw error;
  }
}

/**
 * Get most recently created identities
 */
export async function getRecentIdentities(maxCount: number = 10): Promise<Identity[]> {
  try {
    if (DEMO_MODE) {
      return demoStorage.getIdentities().slice(0, maxCount);
    }
    
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('createdAt', 'desc'),
      limit(maxCount)
    );
    
    const querySnapshot = await getDocs(q);
    const identities: Identity[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data() as FirestoreIdentity;
      
      // Ensure documents object is properly initialized
      const documents = data.documents || {};
      
      // Convert social media join dates back to Date objects
      const socialMedia = Object.entries(data.socialMedia || {}).reduce((acc, [platform, profile]) => {
        if (profile) {
          acc[platform as SocialMediaPlatform] = {
            ...profile,
            joinDate: profile.joinDate instanceof Timestamp ? profile.joinDate.toDate() : profile.joinDate
          };
        }
        return acc;
      }, {} as Identity['socialMedia']);
      
      identities.push({
        ...data,
        id: doc.id,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
        expiresAt: data.expiresAt instanceof Timestamp ? data.expiresAt.toDate() : new Date(),
        autodelete: {
          enabled: data.autodelete?.enabled || false,
          deleteAt: data.autodelete?.deleteAt instanceof Timestamp ? data.autodelete.deleteAt.toDate() : new Date(Date.now() + 24 * 60 * 60000),
          timeoutMinutes: data.autodelete?.timeoutMinutes || 24 * 60
        },
        documents: {
          idcard: documents.idcard || undefined,
          passport: documents.passport || undefined,
          driverlicense: documents.driverlicense || undefined
        },
        socialMedia,
        tempEmail: data.tempEmail || {
          address: '',
          accessUrl: '',
          provider: '',
        },
        banking: data.banking || {
          bankName: '',
          accountNumber: '',
          routingNumber: '',
          accountType: 'checking',
          balance: 0,
          currency: '',
        }
      });
    });
    
    return identities;
  } catch (error) {
    console.error('Error getting recent identities:', error);
    throw error;
  }
}

/**
 * Delete an identity
 */
export async function deleteIdentity(id: string): Promise<void> {
  try {
    if (DEMO_MODE) {
      demoStorage.removeIdentity(id);
      return;
    }
    
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting identity:', error);
    throw error;
  }
}

/**
 * Update the auto-delete settings for an identity
 */
export async function updateAutoDeleteSettings(
  id: string, 
  enabled: boolean, 
  timeoutMinutes: number
): Promise<Identity | null> {
  try {
    const identity = await getIdentityById(id);
    if (!identity) return null;
    
    // Calculate new delete time
    const deleteAt = new Date(Date.now() + timeoutMinutes * 60000);
    
    if (DEMO_MODE) {
      // Update in local storage
      const identities = demoStorage.getIdentities();
      const index = identities.findIndex(i => i.id === id);
      
      if (index >= 0) {
        identities[index] = {
          ...identities[index],
          autodelete: {
            enabled,
            deleteAt,
            timeoutMinutes
          }
        };
        demoStorage.saveIdentities(identities);
        return identities[index];
      }
      return null;
    }
    
    // Update in Firestore
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      'autodelete.enabled': enabled,
      'autodelete.deleteAt': Timestamp.fromDate(deleteAt),
      'autodelete.timeoutMinutes': timeoutMinutes
    });
    
    // Return updated identity
    return {
      ...identity,
      autodelete: {
        enabled,
        deleteAt,
        timeoutMinutes
      }
    };
  } catch (error) {
    console.error('Error updating auto-delete settings:', error);
    throw error;
  }
}

/**
 * Check for and delete expired identities
 */
export async function checkAndDeleteExpiredIdentities(): Promise<number> {
  try {
    let deletedCount = 0;
    
    if (DEMO_MODE) {
      const identities = demoStorage.getIdentities();
      const now = new Date();
      const remaining = identities.filter(identity => {
        if (identity.autodelete.enabled && identity.autodelete.deleteAt <= now) {
          deletedCount++;
          return false;
        }
        return true;
      });
      
      if (deletedCount > 0) {
        demoStorage.saveIdentities(remaining);
      }
      
      return deletedCount;
    }
    
    // For Firestore, query identities with auto-delete enabled and expired
    const now = Timestamp.fromDate(new Date());
    const q = query(
      collection(db, COLLECTION_NAME),
      where('autodelete.enabled', '==', true),
      where('autodelete.deleteAt', '<=', now)
    );
    
    const querySnapshot = await getDocs(q);
    const batch = writeBatch(db);
    
    querySnapshot.forEach(document => {
      batch.delete(doc(db, COLLECTION_NAME, document.id));
      deletedCount++;
    });
    
    if (deletedCount > 0) {
      await batch.commit();
    }
    
    return deletedCount;
  } catch (error) {
    console.error('Error checking for expired identities:', error);
    return 0;
  }
} 