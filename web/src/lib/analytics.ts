// Google Analytics 4 tracking for Santvaani.
// The legacy app also logged through Firebase Analytics, but it reports to the same GA4 property,
// so the Next.js app sends events once, through gtag (loaded by @next/third-parties in the root layout).

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-ZHVJ87Y1C7';

const gtag = (...args: any[]) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') window.gtag(...args);
};

export const trackPageView = (pagePath: string, pageTitle: string) => {
  gtag('event', 'page_view', { page_path: pagePath, page_title: pageTitle });
};

export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  gtag('event', eventName, { platform: 'web', ...parameters });
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
  trackPageView,
  trackEvent,
  trackSpiritualEvents,
  trackEcommerce,
  trackUserBehavior,
  trackConversions,
};