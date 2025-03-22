import React, { useEffect, useState } from 'react';
import { Identity } from '../../lib/identityGenerator';
import { formatDate } from '../../lib/utils';
import { generateQRCodeForIdentity } from '../../lib/qrCodeUtils';
import LoadingSpinner from '../ui/LoadingSpinner';

interface DocumentBaseProps {
  identity: Identity;
  documentTitle: string;
  children: React.ReactNode;
}

const DocumentBase: React.FC<DocumentBaseProps> = ({ identity, documentTitle, children }) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateQR = async () => {
      try {
        setIsLoading(true);
        const dataUrl = await generateQRCodeForIdentity(identity);
        setQrCodeDataUrl(dataUrl);
        setError(null);
      } catch (err) {
        console.error('Error generating QR code:', err);
        setError('Failed to generate QR code');
      } finally {
        setIsLoading(false);
      }
    };

    generateQR();
  }, [identity]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{documentTitle}</h3>
      </div>
      
      <div className="p-5">
        {/* Document content provided by children */}
        {children}
        
        {/* QR Code section */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Verification QR Code</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 sm:mb-0">
                Scan this code to verify the authenticity of this document
              </p>
            </div>
            
            <div className="bg-white p-2 rounded-md">
              {isLoading ? (
                <div className="w-32 h-32 flex items-center justify-center">
                  <LoadingSpinner size="md" />
                </div>
              ) : error ? (
                <div className="w-32 h-32 flex items-center justify-center bg-red-50 text-red-500 text-sm text-center">
                  QR code generation failed
                </div>
              ) : (
                <img 
                  src={qrCodeDataUrl || ''}
                  alt="Verification QR Code"
                  className="w-32 h-32"
                />
              )}
            </div>
          </div>
          
          <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
            <p>This document is provided for testing purposes only and is not a legal document.</p>
            <p>Expires: {formatDate(identity.expiresAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentBase; 