import React from 'react';
import { Identity } from '../lib/identityGenerator';
import Card, { CardHeader, CardTitle, CardContent } from './ui/Card';
import { FaEnvelope, FaKey, FaExternalLinkAlt, FaInfoCircle } from 'react-icons/fa';
import Button from './ui/Button';

interface TempEmailAccessProps {
  identity: Identity;
}

const TempEmailAccess: React.FC<TempEmailAccessProps> = ({ identity }) => {
  const { tempEmail } = identity;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FaEnvelope className="mr-2" />
          Temporary Email Access
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200 rounded-lg flex items-start">
            <FaInfoCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm">
              This temporary email is fully functional. You can use it for testing and receive actual emails. 
              The inbox is public, so don't use it for sensitive information.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Email Address</p>
              <div className="flex items-center">
                <p className="text-sm font-medium break-all">{tempEmail.address}</p>
                <button 
                  className="ml-2 text-blue-500 hover:text-blue-700"
                  onClick={() => {
                    navigator.clipboard.writeText(tempEmail.address);
                    // You could add a toast notification here
                  }}
                  title="Copy to clipboard"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Provider</p>
              <p className="text-sm font-medium">{tempEmail.provider}</p>
            </div>

            {tempEmail.password && (
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center">
                  <FaKey className="mr-1 w-3 h-3" /> Password (if needed)
                </p>
                <p className="text-sm font-medium">{tempEmail.password}</p>
              </div>
            )}
          </div>

          <div className="mt-4">
            <Button 
              className="w-full flex items-center justify-center"
              onClick={() => window.open(tempEmail.accessUrl, '_blank')}
            >
              <span className="mr-2">Access Inbox</span>
              <FaExternalLinkAlt className="w-3 h-3" />
            </Button>
          </div>

          <div className="mt-4 p-4 bg-yellow-50 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200 rounded-lg text-sm">
            <p className="font-semibold mb-1">How to use:</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Click "Access Inbox" to open the temporary mailbox</li>
              <li>Use this email address for account registrations</li>
              <li>Return to the inbox to view received messages</li>
              <li>Some providers may require additional steps - follow their instructions</li>
            </ol>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TempEmailAccess; 