import React, { useEffect, useRef } from 'react';
import { useGoogleAds, GoogleAdsConfig } from '../hooks/useGoogleAds';

interface GoogleAdsProps extends Partial<GoogleAdsConfig> {
  className?: string;
  adPosition?: 'footer' | 'sidebar' | 'content' | 'responsive';
}

export default function GoogleAds({
  className = '',
  adPosition = 'responsive',
  ...config
}: GoogleAdsProps) {
  const { isLoaded, displayAd, getAdMarkup } = useGoogleAds(config);
  const adRef = useRef<HTMLDivElement>(null);

  // Customize styles based on ad position
  const getPositionStyles = () => {
    switch (adPosition) {
      case 'footer':
        return 'w-full py-2 border-t border-gray-200 dark:border-gray-700';
      case 'sidebar':
        return 'w-full md:w-[300px] sticky top-4';
      case 'content':
        return 'w-full my-6 py-2';
      case 'responsive':
      default:
        return 'w-full';
    }
  };

  useEffect(() => {
    // Display ad once the component and ad script are loaded
    if (isLoaded && adRef.current) {
      displayAd();
    }
  }, [isLoaded, displayAd]);

  return (
    <div 
      ref={adRef}
      className={`ad-container ${getPositionStyles()} ${className}`}
      dangerouslySetInnerHTML={getAdMarkup()}
    />
  );
} 