// Google Analytics 4 Integration for Santvaani
// This module provides comprehensive tracking for spiritual content engagement
// Integrated with Firebase Analytics (santvaani-production)

import { analytics } from './firebase';
import { logEvent, setCurrentScreen, setUserId, setUserProperties } from 'firebase/analytics';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-ZHVJ87Y1C7';

// Initialize Google Analytics (Firebase Analytics is already initialized in firebase.ts)
export const initGA = () => {
  console.log('🔥 Firebase Analytics already initialized for Santvaani Production');

  // Also set up gtag for additional tracking if needed
  if (GA_MEASUREMENT_ID) {
    // Create script tag for gtag (for enhanced tracking)
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // Initialize dataLayer and gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_title: document.title,
      page_location: window.location.href,
      send_page_view: false, // We'll handle page views manually
    });
  }
};

// Track page views (using both Firebase Analytics and gtag)
export const trackPageView = (pagePath: string, pageTitle: string) => {
  // Firebase Analytics
  if (analytics) {
    setCurrentScreen(analytics, pageTitle);
    logEvent(analytics, 'page_view', {
      page_path: pagePath,
      page_title: pageTitle,
    });
  }

  // Also use gtag for additional tracking
  if (window.gtag && GA_MEASUREMENT_ID) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: pagePath,
      page_title: pageTitle,
    });
  }
};

// Track custom events (using Firebase Analytics)
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  // Firebase Analytics (primary method)
  if (analytics) {
    logEvent(analytics, eventName, {
      timestamp: new Date().toISOString(),
      platform: 'web',
      ...parameters,
    });
  }

  // Fallback to gtag
  if (window.gtag && GA_MEASUREMENT_ID) {
    window.gtag('event', eventName, {
      custom_parameter: true,
      ...parameters,
    });
  }
};

// Spiritual content specific tracking events
export const trackSpiritualEvents = {
  // Track saint page visits
  saintPageView: (saintName: string) => {
    trackEvent('saint_page_view', {
      saint_name: saintName,
      content_type: 'saint_biography',
      category: 'spiritual_content',
    });
  },

  // Track daily guide interactions
  dailyGuideView: (guideType: string) => {
    trackEvent('daily_guide_view', {
      guide_type: guideType,
      content_type: 'daily_spiritual_guide',
      category: 'spiritual_guidance',
    });
  },

  // Track horoscope views
  horoscopeView: (zodiacSign?: string) => {
    trackEvent('horoscope_view', {
      zodiac_sign: zodiacSign || 'all',
      content_type: 'spiritual_horoscope',
      category: 'astrology',
    });
  },

  // Track bhajan interactions
  bhajanPlay: (bhajanTitle: string, bhajanId: string) => {
    trackEvent('bhajan_play', {
      bhajan_title: bhajanTitle,
      bhajan_id: bhajanId,
      content_type: 'spiritual_music',
      category: 'bhajans',
    });
  },

  // Track spiritual quote views
  quoteView: (quoteId: string, saintName?: string) => {
    trackEvent('spiritual_quote_view', {
      quote_id: quoteId,
      saint_name: saintName || 'unknown',
      content_type: 'spiritual_quote',
      category: 'wisdom',
    });
  },

  // Track feedback submissions
  feedbackSubmit: (feedbackType: string, rating?: number) => {
    trackEvent('feedback_submit', {
      feedback_type: feedbackType,
      rating: rating,
      category: 'user_engagement',
    });
  },

  // Track event registrations
  eventRegister: (eventTitle: string, eventType: string) => {
    trackEvent('spiritual_event_register', {
      event_title: eventTitle,
      event_type: eventType,
      category: 'community_engagement',
    });
  },

  // Track search queries
  searchQuery: (query: string, resultsCount: number) => {
    trackEvent('site_search', {
      search_term: query,
      results_count: resultsCount,
      category: 'search',
    });
  },

  // Track visitor counter interactions
  visitorCounterView: (count: number) => {
    trackEvent('visitor_counter_view', {
      visitor_count: count,
      category: 'engagement',
    });
  },

  // Track language changes
  languageChange: (fromLang: string, toLang: string) => {
    trackEvent('language_change', {
      from_language: fromLang,
      to_language: toLang,
      category: 'localization',
    });
  },

  // Track time spent reading spiritual content
  contentEngagement: (contentType: string, timeSpent: number) => {
    trackEvent('content_engagement', {
      content_type: contentType,
      time_spent_seconds: timeSpent,
      category: 'engagement',
    });
  },
};

// Enhanced ecommerce tracking (for future donation/premium features)
export const trackEcommerce = {
  // Track donation attempts
  beginDonation: (amount: number, currency: string = 'INR') => {
    trackEvent('begin_checkout', {
      currency: currency,
      value: amount,
      items: [
        {
          item_id: 'donation',
          item_name: 'Santvaani Donation',
          category: 'donation',
          quantity: 1,
          price: amount,
        },
      ],
    });
  },

  // Track completed donations
  completeDonation: (amount: number, currency: string = 'INR', transactionId: string) => {
    trackEvent('purchase', {
      transaction_id: transactionId,
      currency: currency,
      value: amount,
      items: [
        {
          item_id: 'donation',
          item_name: 'Santvaani Donation',
          category: 'donation',
          quantity: 1,
          price: amount,
        },
      ],
    });
  },
};

// User engagement tracking
export const trackUserBehavior = {
  // Track scroll depth
  scrollDepth: (percentage: number, pagePath: string) => {
    trackEvent('scroll', {
      percent_scrolled: percentage,
      page_path: pagePath,
      category: 'engagement',
    });
  },

  // Track time on page
  timeOnPage: (seconds: number, pagePath: string) => {
    trackEvent('timing_complete', {
      name: 'page_read_time',
      value: Math.round(seconds * 1000), // Convert to milliseconds
      page_path: pagePath,
      category: 'engagement',
    });
  },

  // Track social shares
  socialShare: (platform: string, contentType: string, contentId: string) => {
    trackEvent('share', {
      method: platform,
      content_type: contentType,
      content_id: contentId,
      category: 'social',
    });
  },
};

// Conversion tracking
export const trackConversions = {
  // Newsletter signup
  newsletterSignup: (source: string) => {
    trackEvent('sign_up', {
      method: 'newsletter',
      source: source,
      category: 'conversion',
    });
  },

  // Community join
  communityJoin: (method: string) => {
    trackEvent('join_group', {
      group_id: 'santvaani_community',
      method: method,
      category: 'conversion',
    });
  },

  // Contact form submission
  contactSubmit: (source: string) => {
    trackEvent('generate_lead', {
      source: source,
      category: 'conversion',
    });
  },
};

export default {
  initGA,
  trackPageView,
  trackEvent,
  trackSpiritualEvents,
  trackEcommerce,
  trackUserBehavior,
  trackConversions,
};