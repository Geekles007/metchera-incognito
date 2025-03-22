'use client';

import {
  ClockIcon,
  CreditCardIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  TrashIcon,
  UserGroupIcon,
  UserIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import AutoDeleteControls from '../components/AutoDeleteControls';
import BankingDetails from '../components/BankingDetails';
import DocumentSelector from '../components/DocumentSelector';
import DocumentViewer from '../components/DocumentViewer';
import GoogleAds from '../components/GoogleAds';
import IdentityCard from '../components/IdentityCard';
import ResponsiveDataTable from '../components/ResponsiveDataTable';
import SocialMediaProfiles from '../components/SocialMediaProfiles';
import TempEmailAccess from '../components/TempEmailAccess';
import Button from '../components/ui/Button';
import Card, { CardContent, CardDescription, CardTitle } from '../components/ui/Card';
import { useIdentity } from '../contexts/IdentityContext';
import { downloadIdentityAsJSON } from '../lib/downloadUtils';
import { DocumentType } from '../lib/identityGenerator';

export default function Home() {
  const { 
    currentIdentity, 
    recentIdentities, 
    loading, 
    error, 
    generateIdentity, 
    clearCurrentIdentity,
    isFirestoreConnected,
    getIdentity,
    updateIdentity
  } = useIdentity();

  const [showRecent, setShowRecent] = useState(false);
  const [activeTab, setActiveTab] = useState<'identity' | 'documents' | 'social' | 'email' | 'banking' | 'auto-delete'>('identity');
  
  const handleGenerateDocument = (documentType: DocumentType) => {
    generateIdentity(documentType);
  };

  const handleIdentityUpdated = (updatedIdentity: any) => {
    // Update the identity in the context
    if (updatedIdentity && updatedIdentity.id === currentIdentity?.id) {
      updateIdentity(updatedIdentity);
    }
  };

  const handleDownloadIdentity = () => {
    if (currentIdentity) {
      downloadIdentityAsJSON(currentIdentity);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Toaster position="top-right" />
      
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <UserIcon className="h-8 w-8 text-primary mr-3" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Metchera ID Generator</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/validate">
                <Button variant="outline" leftIcon={<DocumentTextIcon className="h-5 w-5" />}>
                  Validate QR
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="ghost" leftIcon={<InformationCircleIcon className="h-5 w-5" />}>
                  About
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isFirestoreConnected && (
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md flex items-start gap-3">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-800 dark:text-yellow-400">Demo Mode Active</h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-500 mt-1">
                Firebase connection unavailable. Using local storage instead. Your identities will only be saved in this browser and may be lost when clearing browser data.
              </p>
              <p className="text-xs text-yellow-600 dark:text-yellow-600 mt-2">
                To use the full version, please configure your Firebase credentials in the .env.local file.
              </p>
            </div>
          </div>
        )}

        {/* Hero section */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Generate Comprehensive Identity Profiles
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Create realistic temporary identities with names, addresses, official documents, social media profiles, 
              temporary email access, and banking details for testing. Perfect for development, privacy, or any situation 
              where you need complete temporary identity profiles.
            </p>
          </div>

          <div className="flex justify-center mb-8 space-x-4">
            <Button
              size="lg"
              leftIcon={<UserPlusIcon className="h-5 w-5" />}
              onClick={() => generateIdentity()}
              isLoading={loading}
            >
              Generate New Identity
            </Button>
            <Button
              size="lg"
              variant="outline"
              leftIcon={<ClockIcon className="h-5 w-5" />}
              onClick={() => setShowRecent(!showRecent)}
            >
              {showRecent ? 'Hide Recent' : 'Show Recent Identities'}
            </Button>
          </div>
          
          {/* Tab Selection */}
          {currentIdentity && (
            <div className="flex justify-center mb-6 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
              <button
                className={`px-4 py-2 font-medium text-sm flex items-center ${
                  activeTab === 'identity'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                onClick={() => setActiveTab('identity')}
              >
                <UserIcon className="h-4 w-4 mr-1" />
                Identity
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm flex items-center ${
                  activeTab === 'documents'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                onClick={() => setActiveTab('documents')}
              >
                <DocumentTextIcon className="h-4 w-4 mr-1" />
                Documents
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm flex items-center ${
                  activeTab === 'social'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                onClick={() => setActiveTab('social')}
              >
                <UserGroupIcon className="h-4 w-4 mr-1" />
                Social Media
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm flex items-center ${
                  activeTab === 'email'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                onClick={() => setActiveTab('email')}
              >
                <EnvelopeIcon className="h-4 w-4 mr-1" />
                Email
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm flex items-center ${
                  activeTab === 'banking'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                onClick={() => setActiveTab('banking')}
              >
                <CreditCardIcon className="h-4 w-4 mr-1" />
                Banking
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm flex items-center ${
                  activeTab === 'auto-delete'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                onClick={() => setActiveTab('auto-delete')}
              >
                <TrashIcon className="h-4 w-4 mr-1" />
                Auto-Delete
              </button>
            </div>
          )}
        </section>

        {/* Google Ad - Top Banner */}
        <GoogleAds adPosition="content" className="mb-8" />

        {/* Current identity or document section */}
        <section className="mb-12">
          {currentIdentity ? (
            <div className="animate-fadeIn">
              {activeTab === 'identity' ? (
                <>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Your Generated Identity
                  </h3>
                  <IdentityCard identity={currentIdentity} />
                </>
              ) : activeTab === 'documents' ? (
                <>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Official Documents
                  </h3>
                  {currentIdentity.documentType ? (
                    <DocumentViewer identity={currentIdentity} />
                  ) : (
                    <DocumentSelector 
                      onSelect={handleGenerateDocument}
                      isLoading={loading}
                    />
                  )}
                </>
              ) : activeTab === 'social' ? (
                <>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Social Media Profiles
                  </h3>
                  <SocialMediaProfiles identity={currentIdentity} />
                </>
              ) : activeTab === 'email' ? (
                <>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Temporary Email Access
                  </h3>
                  <TempEmailAccess identity={currentIdentity} />
                </>
              ) : activeTab === 'banking' ? (
                <>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Banking Details
                  </h3>
                  <BankingDetails identity={currentIdentity} />
                </>
              ) : (
                <>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Auto-Delete Settings
                  </h3>
                  <AutoDeleteControls 
                    identity={currentIdentity} 
                    onIdentityUpdated={handleIdentityUpdated} 
                    onDownloadData={handleDownloadIdentity} 
                  />
                </>
              )}
            </div>
          ) : error ? (
            <Card className="border-red-300 bg-red-50 dark:bg-red-900/20">
              <CardContent className="text-center py-8">
                <p className="text-red-600 dark:text-red-400">{error}</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => clearCurrentIdentity()}
                >
                  Try Again
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <UserIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <CardTitle>No Identity Generated Yet</CardTitle>
                <CardDescription className="mt-2 mb-6">
                  Click the "Generate New Identity" button to create a temporary identity.
                </CardDescription>
                <Button
                  leftIcon={<UserPlusIcon className="h-5 w-5" />}
                  onClick={() => generateIdentity()}
                  isLoading={loading}
                >
                  Generate New Identity
                </Button>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Google Ad - Middle */}
        <GoogleAds adPosition="content" className="my-8" />

        {/* Recent identities section */}
        {showRecent && (
          <section>
            {recentIdentities.length > 0 ? (
              <ResponsiveDataTable 
                identities={recentIdentities} 
                title="Recent Identities"
              />
            ) : (
              <Card className="text-center py-8">
                <CardContent>
                  <p className="text-gray-500 dark:text-gray-400">
                    No recent identities found.
                  </p>
                </CardContent>
              </Card>
            )}
          </section>
        )}
      </main>

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              © {new Date().getFullYear()} Metchera ID Generator. All rights reserved.
            </p>
            <div className="text-gray-500 dark:text-gray-400 text-sm mt-2 md:mt-0">
              <p className="text-center md:text-right">
                This service is for educational and testing purposes only.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Google Ads - Footer Ad */}
      <div className="fixed bottom-0 inset-x-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <GoogleAds adPosition="footer" />
      </div>
    </div>
  );
}
