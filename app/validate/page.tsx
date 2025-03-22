'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { validateQRCode } from '../../lib/qrCodeUtils';
import Card, { CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function QRValidationPage() {
  const router = useRouter();
  const [qrResult, setQrResult] = useState<{
    valid: boolean;
    data?: any;
    error?: string;
  } | null>(null);
  const [qrValue, setQrValue] = useState<string>('');

  const handleQRValidate = () => {
    if (!qrValue) {
      return;
    }

    try {
      const result = validateQRCode(qrValue);
      setQrResult(result);
    } catch (error) {
      setQrResult({
        valid: false,
        error: 'Failed to process QR code data'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" leftIcon={<ArrowLeftIcon className="h-5 w-5" />}>
              Back to Home
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">QR Code Validation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300 text-center mb-8">
              Paste the QR code data to validate its authenticity
            </p>

            <div className="mb-6">
              <label 
                htmlFor="qr-data" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                QR Code Data (Base64)
              </label>
              <textarea
                id="qr-data"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary"
                rows={5}
                value={qrValue}
                onChange={(e) => setQrValue(e.target.value)}
                placeholder="Paste the QR code data here..."
              />
            </div>

            <div className="text-center">
              <Button
                onClick={handleQRValidate}
                disabled={!qrValue}
              >
                Validate QR Code
              </Button>
            </div>

            {qrResult && (
              <div className={`mt-8 p-4 rounded-md ${
                qrResult.valid 
                  ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                  : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
              }`}>
                <div className="flex items-start">
                  {qrResult.valid ? (
                    <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400 mr-3 flex-shrink-0" />
                  ) : (
                    <XCircleIcon className="h-6 w-6 text-red-600 dark:text-red-400 mr-3 flex-shrink-0" />
                  )}
                  <div>
                    <h3 className={`font-medium ${
                      qrResult.valid ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'
                    }`}>
                      {qrResult.valid ? 'Valid Document' : 'Invalid Document'}
                    </h3>
                    
                    {qrResult.error && (
                      <p className="text-red-600 dark:text-red-400 mt-1">
                        {qrResult.error}
                      </p>
                    )}
                    
                    {qrResult.valid && qrResult.data && (
                      <div className="mt-3">
                        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Document Information:</h4>
                        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                          <dt className="text-gray-500 dark:text-gray-400">Name:</dt>
                          <dd className="text-gray-900 dark:text-white">{qrResult.data.name}</dd>
                          
                          <dt className="text-gray-500 dark:text-gray-400">Document Type:</dt>
                          <dd className="text-gray-900 dark:text-white capitalize">{qrResult.data.docType}</dd>
                          
                          <dt className="text-gray-500 dark:text-gray-400">Document Number:</dt>
                          <dd className="text-gray-900 dark:text-white">{qrResult.data.docNumber}</dd>
                          
                          <dt className="text-gray-500 dark:text-gray-400">Expires:</dt>
                          <dd className="text-gray-900 dark:text-white">
                            {new Date(qrResult.data.expires).toLocaleDateString()}
                          </dd>
                        </dl>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 