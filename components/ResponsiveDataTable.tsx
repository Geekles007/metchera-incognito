import React, { useState } from 'react';
import { Identity } from '../lib/identityGenerator';
import Button from './ui/Button';
import IdentityDataTable from './IdentityDataTable';
import IdentityCard from './IdentityCard';

interface ResponsiveDataTableProps {
  identities: Identity[];
  title: string;
}

export default function ResponsiveDataTable({ identities, title }: ResponsiveDataTableProps) {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  
  // Dynamically determine view mode based on screen width on component mount
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setViewMode('cards');
      } else {
        setViewMode('table');
      }
    };
    
    // Set initial value
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
        <div className="flex space-x-2">
          <Button 
            size="xs"
            variant={viewMode === 'table' ? 'primary' : 'outline'}
            onClick={() => setViewMode('table')}
          >
            Table View
          </Button>
          <Button 
            size="xs"
            variant={viewMode === 'cards' ? 'primary' : 'outline'}
            onClick={() => setViewMode('cards')}
          >
            Card View
          </Button>
        </div>
      </div>

      {viewMode === 'table' ? (
        <IdentityDataTable identities={identities} />
      ) : (
        <div className="space-y-6">
          {identities.length > 0 ? (
            identities.map((identity) => (
              <IdentityCard key={identity.id} identity={identity} />
            ))
          ) : (
            <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">
                No identities found
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 