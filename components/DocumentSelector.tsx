import React from 'react';
import { DocumentType } from '../lib/identityGenerator';
import { 
  IdentificationIcon, 
  GlobeAltIcon, 
  TruckIcon 
} from '@heroicons/react/24/outline';
import Button from './ui/Button';

interface DocumentSelectorProps {
  onSelect: (documentType: DocumentType) => void;
  isLoading: boolean;
}

const DocumentSelector: React.FC<DocumentSelectorProps> = ({ onSelect, isLoading }) => {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Select Document Type
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DocumentOption 
          icon={<IdentificationIcon className="h-8 w-8" />}
          title="ID Card"
          description="Generate a national identification card with personal details."
          onClick={() => onSelect('idcard')}
          isLoading={isLoading}
        />
        
        <DocumentOption 
          icon={<GlobeAltIcon className="h-8 w-8" />}
          title="Passport"
          description="Create an international travel document with photo and personal data."
          onClick={() => onSelect('passport')}
          isLoading={isLoading}
        />
        
        <DocumentOption 
          icon={<TruckIcon className="h-8 w-8" />}
          title="Driver's License"
          description="Generate a driving permit with classification and restrictions."
          onClick={() => onSelect('driverlicense')}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

interface DocumentOptionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  isLoading: boolean;
}

const DocumentOption: React.FC<DocumentOptionProps> = ({ 
  icon, 
  title, 
  description, 
  onClick,
  isLoading
}) => {
  return (
    <div className="flex flex-col items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
      <div className="text-primary mb-3">
        {icon}
      </div>
      
      <h4 className="text-gray-900 dark:text-white font-medium text-lg mb-2">
        {title}
      </h4>
      
      <p className="text-gray-600 dark:text-gray-400 text-sm text-center mb-4">
        {description}
      </p>
      
      <Button 
        onClick={onClick}
        isLoading={isLoading}
        className="mt-auto"
      >
        Generate
      </Button>
    </div>
  );
};

export default DocumentSelector; 