// Analytics Provider Component - Handles analytics initialization and tracking
import { useEffect } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { initGA } from '@/lib/analytics';

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  // Initialize Google Analytics on mount
  useEffect(() => {
    console.log('🎯 Initializing Google Analytics for Santvaani...');
    initGA();
  }, []);

  // Use analytics hook for automatic tracking
  useAnalytics();

  return <>{children}</>;
};

export default AnalyticsProvider;