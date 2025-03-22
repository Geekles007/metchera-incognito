'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';
import { 
  generateAndSaveIdentity, 
  getRecentIdentities, 
  getIdentityById,
  deleteIdentity as deleteIdentityService,
  updateAutoDeleteSettings
} from '../lib/identityService';
import { Identity, DocumentType } from '../lib/identityGenerator';

interface IdentityContextType {
  currentIdentity: Identity | null;
  recentIdentities: Identity[];
  loading: boolean;
  error: string | null;
  generateIdentity: (documentType?: DocumentType) => Promise<void>;
  getIdentity: (id: string) => Promise<void>;
  deleteIdentity: (id: string) => Promise<void>;
  clearCurrentIdentity: () => void;
  isFirestoreConnected: boolean;
  updateIdentity: (identity: Identity) => void;
}

const IdentityContext = createContext<IdentityContextType | undefined>(undefined);

export function useIdentity() {
  const context = useContext(IdentityContext);
  if (context === undefined) {
    throw new Error('useIdentity must be used within an IdentityProvider');
  }
  return context;
}

interface IdentityProviderProps {
  children: ReactNode;
}

export function IdentityProvider({ children }: IdentityProviderProps) {
  const [currentIdentity, setCurrentIdentity] = useState<Identity | null>(null);
  const [recentIdentities, setRecentIdentities] = useState<Identity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isFirestoreConnected, setIsFirestoreConnected] = useState<boolean>(true);

  // Load recent identities on mount
  useEffect(() => {
    const loadRecentIdentities = async () => {
      try {
        setLoading(true);
        const identities = await getRecentIdentities(5);
        setRecentIdentities(identities);
        setIsFirestoreConnected(true);
      } catch (err) {
        console.error(err);
        
        if (String(err).includes('Firestore') || String(err).includes('Firebase')) {
          setIsFirestoreConnected(false);
          setError('Firestore connection failed. Using local storage instead.');
          toast.error('Firestore connection failed. Using local storage instead.', { duration: 5000 });
        } else {
          setError('Failed to load recent identities');
        }
      } finally {
        setLoading(false);
      }
    };

    loadRecentIdentities();
  }, []);

  // Generate a new identity
  const generateIdentity = async (documentType?: DocumentType) => {
    try {
      setLoading(true);
      setError(null);
      
      const newIdentity = await generateAndSaveIdentity(documentType);
      setCurrentIdentity(newIdentity);
      
      // Update recent identities list
      setRecentIdentities(prev => [newIdentity, ...prev.slice(0, 4)]);
      
      toast.success('New identity generated successfully!');
    } catch (err) {
      setError('Failed to generate identity');
      toast.error('Failed to generate identity');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Get an identity by ID
  const getIdentity = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const identity = await getIdentityById(id);
      if (identity) {
        setCurrentIdentity(identity);
      } else {
        setError('Identity not found');
        toast.error('Identity not found');
      }
    } catch (err) {
      setError('Failed to retrieve identity');
      toast.error('Failed to retrieve identity');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Delete an identity
  const deleteIdentity = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await deleteIdentityService(id);
      
      // Remove from recent identities
      setRecentIdentities(prev => prev.filter(identity => identity.id !== id));
      
      // Clear current identity if it's the one being deleted
      if (currentIdentity && currentIdentity.id === id) {
        setCurrentIdentity(null);
      }
      
      toast.success('Identity deleted successfully');
    } catch (err) {
      setError('Failed to delete identity');
      toast.error('Failed to delete identity');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Clear current identity
  const clearCurrentIdentity = () => {
    setCurrentIdentity(null);
  };

  // Update current identity
  const updateIdentity = (identity: Identity) => {
    setCurrentIdentity(identity);
    
    // Also update in recent identities list if it exists there
    setRecentIdentities(prev => 
      prev.map(item => item.id === identity.id ? identity : item)
    );
  };

  const value = {
    currentIdentity,
    recentIdentities,
    loading,
    error,
    generateIdentity,
    getIdentity,
    deleteIdentity,
    clearCurrentIdentity,
    isFirestoreConnected,
    updateIdentity
  };

  return (
    <IdentityContext.Provider value={value}>
      {children}
    </IdentityContext.Provider>
  );
} 