'use client';

import { useEffect } from 'react';
import { setupAutoDeleteInterval } from '../lib/autoDeleteService';

/**
 * Component that sets up auto-delete checking
 * This can be included once at the application root level
 */
const AutoDeleteScheduler: React.FC = () => {
  useEffect(() => {
    // Set up checking for expired identities every minute
    const cancelInterval = setupAutoDeleteInterval(1);
    
    // Clean up on unmount
    return () => {
      cancelInterval();
    };
  }, []);
  
  // This component doesn't render anything
  return null;
};

export default AutoDeleteScheduler; 