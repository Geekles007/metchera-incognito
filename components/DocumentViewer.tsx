import React from 'react';
import { Identity } from '../lib/identityGenerator';
import IdCard from './documents/IdCard';
import Passport from './documents/Passport';
import DriverLicense from './documents/DriverLicense';
import Card from './ui/Card';

interface DocumentViewerProps {
  identity: Identity;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ identity }) => {
  // Get the document type or default to ID card
  const documentType = identity.documentType || 'idcard';
  
  // Check if the selected document type has data
  const hasDocumentData = !!identity.documents[documentType];
  
  if (!hasDocumentData) {
    return (
      <Card>
        <div className="p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Document Data Not Available
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            The selected document type ({documentType}) could not be generated for this identity.
          </p>
        </div>
      </Card>
    );
  }
  
  // Render the appropriate document component based on type
  switch (documentType) {
    case 'idcard':
      return <IdCard identity={identity} />;
    case 'passport':
      return <Passport identity={identity} />;
    case 'driverlicense':
      return <DriverLicense identity={identity} />;
    default:
      return <div>Unknown document type</div>;
  }
};

export default DocumentViewer; 