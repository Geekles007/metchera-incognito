import { useEffect, useState } from 'react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export interface GoogleAdsConfig {
  adClient: string;
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  fullWidthResponsive?: boolean;
}

/**
 * Hook to handle Google Ads integration
 */
export function useGoogleAds(config?: Partial<GoogleAdsConfig>) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Default configuration
  const defaultConfig: GoogleAdsConfig = {
    // Replace with your actual Ad Client ID when in production
    adClient: process.env.NEXT_PUBLIC_GOOGLE_AD_CLIENT || 'ca-pub-xxxxxxxxxxxxxxxx',
    // Replace with your actual Ad Slot when in production
    adSlot: process.env.NEXT_PUBLIC_GOOGLE_AD_SLOT || '1234567890',
    adFormat: 'auto',
    fullWidthResponsive: true,
  };
  
  const finalConfig = { ...defaultConfig, ...config };
  
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    try {
      // Load Google Ads script if not already loaded
      if (!window.adsbygoogle) {
        window.adsbygoogle = window.adsbygoogle || [];
        
        const script = document.createElement('script');
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
        script.async = true;
        script.crossOrigin = 'anonymous';
        script.dataset.adClient = finalConfig.adClient;
        
        script.onload = () => {
          setIsLoaded(true);
        };
        
        script.onerror = (error) => {
          setError(new Error('Failed to load Google Ads script'));
          console.error('Google Ads Error:', error);
        };
        
        document.head.appendChild(script);
      } else {
        setIsLoaded(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error in Google Ads loading'));
      console.error('Google Ads Error:', err);
    }
  }, [finalConfig.adClient]);
  
  // Function to display a new ad (can be called after component mount)
  const displayAd = () => {
    if (typeof window === 'undefined' || !isLoaded) return;
    
    try {
      window.adsbygoogle.push({});
    } catch (err) {
      console.error('Error displaying ad:', err);
    }
  };
  
  // Generate the ad HTML (should be used with dangerouslySetInnerHTML in a component)
  const getAdMarkup = () => {
    return {
      __html: `
        <ins class="adsbygoogle"
          style="display:block"
          data-ad-client="${finalConfig.adClient}"
          data-ad-slot="${finalConfig.adSlot}"
          data-ad-format="${finalConfig.adFormat}"
          ${finalConfig.fullWidthResponsive ? 'data-full-width-responsive="true"' : ''}></ins>
      `
    };
  };
  
  return {
    isLoaded,
    error,
    displayAd,
    getAdMarkup,
    config: finalConfig,
  };
} 