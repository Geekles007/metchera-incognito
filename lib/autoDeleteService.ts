import { db } from './firebase';
import { deleteDoc, getDocs, query, where, Timestamp, collection } from 'firebase/firestore';
import { Identity } from './identityGenerator';
import toast from 'react-hot-toast';

const IDENTITIES_COLLECTION = 'identities';

/**
 * Checks for and deletes identities that have passed their auto-delete time
 * This should be called periodically from the application
 */
export const checkAndDeleteExpiredIdentities = async (): Promise<void> => {
  try {
    const now = Timestamp.now();
    
    // Query for identities that have auto-delete enabled and whose deletion time has passed
    const identitiesRef = collection(db, IDENTITIES_COLLECTION);
    const q = query(
      identitiesRef,
      where('autodelete.enabled', '==', true),
      where('autodelete.deleteAt', '<=', now)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return; // No expired identities to delete
    }
    
    // Delete each expired identity
    const deletePromises = querySnapshot.docs.map(async (doc) => {
      try {
        await deleteDoc(doc.ref);
        return doc.id;
      } catch (error) {
        console.error(`Failed to delete expired identity ${doc.id}:`, error);
        return null;
      }
    });
    
    const deletedIds = (await Promise.all(deletePromises)).filter(id => id !== null);
    
    if (deletedIds.length > 0) {
      console.log(`Auto-deleted ${deletedIds.length} expired identities`);
      // Only show toast if we're in a browser environment
      if (typeof window !== 'undefined') {
        toast.success(`Auto-deleted ${deletedIds.length} expired identities`, {
          id: 'auto-delete-notification',
        });
      }
    }
  } catch (error) {
    console.error('Error checking for expired identities:', error);
  }
};

/**
 * Sets up a periodic check for expired identities
 * @param intervalMinutes How often to check for expired identities (in minutes)
 * @returns A function to cancel the interval
 */
export const setupAutoDeleteInterval = (intervalMinutes: number = 1): () => void => {
  // Only set up interval in browser environment
  if (typeof window === 'undefined') {
    return () => {}; // Return empty cleanup function for SSR
  }
  
  // Convert minutes to milliseconds
  const intervalMs = intervalMinutes * 60 * 1000;
  
  // Do an initial check
  checkAndDeleteExpiredIdentities();
  
  // Set up interval
  const intervalId = window.setInterval(() => {
    checkAndDeleteExpiredIdentities();
  }, intervalMs);
  
  // Return function to clear interval
  return () => {
    window.clearInterval(intervalId);
  };
}; 