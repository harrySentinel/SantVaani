// React Hook for Google Analytics Integration
import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import {
  trackPageView,
  trackSpiritualEvents,
  trackUserBehavior,
  trackConversions
} from '@/lib/analytics';

// Custom hook for tracking page views
export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page view on route change
    const pagePath = location.pathname + location.search;
    const pageTitle = document.title;

    trackPageView(pagePath, pageTitle);

    // Track specific page types
    if (location.pathname.includes('/saints/')) {
      const saintName = location.pathname.split('/saints/')[1];
      if (saintName) {
        trackSpiritualEvents.saintPageView(saintName);
      }
    }

    if (location.pathname === '/horoscope') {
      trackSpiritualEvents.horoscopeView();
    }

    if (location.pathname === '/daily-guide') {
      trackSpiritualEvents.dailyGuideView('daily_spiritual_guide');
    }

    if (location.pathname === '/bhajans') {
      // Will be tracked individually when bhajans are played
    }

  }, [location]);
};

// Hook for tracking scroll depth
export const useScrollTracking = () => {
  const location = useLocation();

  useEffect(() => {
    let maxScroll = 0;
    const scrollThresholds = [25, 50, 75, 90, 100];
    const trackedThresholds = new Set<number>();

    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );

      maxScroll = Math.max(maxScroll, scrollPercent);

      // Track scroll milestones
      scrollThresholds.forEach(threshold => {
        if (scrollPercent >= threshold && !trackedThresholds.has(threshold)) {
          trackedThresholds.add(threshold);
          trackUserBehavior.scrollDepth(threshold, location.pathname);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);

      // Track final scroll depth when leaving page
      if (maxScroll > 0) {
        trackUserBehavior.scrollDepth(maxScroll, location.pathname);
      }
    };
  }, [location.pathname]);
};

// Hook for tracking time on page
export const useTimeTracking = () => {
  const location = useLocation();

  useEffect(() => {
    const startTime = Date.now();

    return () => {
      const timeSpent = (Date.now() - startTime) / 1000; // Convert to seconds

      // Only track if user spent meaningful time (more than 10 seconds)
      if (timeSpent > 10) {
        trackUserBehavior.timeOnPage(timeSpent, location.pathname);
      }
    };
  }, [location.pathname]);
};

// Hook for spiritual content tracking
export const useSpiritualTracking = () => {
  const trackQuoteView = useCallback((quoteId: string, saintName?: string) => {
    trackSpiritualEvents.quoteView(quoteId, saintName);
  }, []);

  const trackBhajanPlay = useCallback((bhajanTitle: string, bhajanId: string) => {
    trackSpiritualEvents.bhajanPlay(bhajanTitle, bhajanId);
  }, []);

  const trackEventRegister = useCallback((eventTitle: string, eventType: string) => {
    trackSpiritualEvents.eventRegister(eventTitle, eventType);
  }, []);

  const trackFeedbackSubmit = useCallback((feedbackType: string, rating?: number) => {
    trackSpiritualEvents.feedbackSubmit(feedbackType, rating);
  }, []);

  const trackSearch = useCallback((query: string, resultsCount: number) => {
    trackSpiritualEvents.searchQuery(query, resultsCount);
  }, []);

  const trackLanguageChange = useCallback((fromLang: string, toLang: string) => {
    trackSpiritualEvents.languageChange(fromLang, toLang);
  }, []);

  const trackVisitorCounter = useCallback((count: number) => {
    trackSpiritualEvents.visitorCounterView(count);
  }, []);

  return {
    trackQuoteView,
    trackBhajanPlay,
    trackEventRegister,
    trackFeedbackSubmit,
    trackSearch,
    trackLanguageChange,
    trackVisitorCounter,
  };
};

// Hook for conversion tracking
export const useConversionTracking = () => {
  const trackNewsletterSignup = useCallback((source: string) => {
    trackConversions.newsletterSignup(source);
  }, []);

  const trackCommunityJoin = useCallback((method: string) => {
    trackConversions.communityJoin(method);
  }, []);

  const trackContactSubmit = useCallback((source: string) => {
    trackConversions.contactSubmit(source);
  }, []);

  return {
    trackNewsletterSignup,
    trackCommunityJoin,
    trackContactSubmit,
  };
};

// Hook for social sharing
export const useSocialTracking = () => {
  const trackSocialShare = useCallback((platform: string, contentType: string, contentId: string) => {
    trackUserBehavior.socialShare(platform, contentType, contentId);
  }, []);

  return { trackSocialShare };
};

// Combined analytics hook with all tracking functionality
export const useAnalytics = () => {
  usePageTracking();
  useScrollTracking();
  useTimeTracking();

  const spiritual = useSpiritualTracking();
  const conversion = useConversionTracking();
  const social = useSocialTracking();

  return {
    ...spiritual,
    ...conversion,
    ...social,
  };
};