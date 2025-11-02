import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const MIN_READ_TIME_MS = 3000; // 3 seconds minimum read time

/**
 * Server-side IP-based blog view tracking hook
 * Replaces localStorage approach with reliable server-side tracking
 *
 * Features:
 * - IP-based deduplication (24-hour cooldown)
 * - Server-side tracking for cross-device consistency
 * - Minimum 3-second read time before counting view
 * - No localStorage required
 *
 * @param postId - The ID of the blog post to track
 * @returns Object with viewRecorded status
 */
export function useServerBlogView(postId: string | number) {
  const [viewRecorded, setViewRecorded] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const hasAttemptedTracking = useRef(false);
  const pageLoadTime = useRef<number>(Date.now());

  useEffect(() => {
    // Reset when post changes
    if (postId) {
      hasAttemptedTracking.current = false;
      setViewRecorded(false);
      pageLoadTime.current = Date.now();
    }
  }, [postId]);

  useEffect(() => {
    // Don't track if no post ID or already attempted
    if (!postId || hasAttemptedTracking.current || isTracking) {
      return;
    }

    const trackView = async () => {
      try {
        // Wait for minimum read time before tracking
        const timeOnPage = Date.now() - pageLoadTime.current;
        const remainingTime = MIN_READ_TIME_MS - timeOnPage;

        if (remainingTime > 0) {
          console.log(`⏳ Waiting ${remainingTime}ms before tracking view...`);
          await new Promise(resolve => setTimeout(resolve, remainingTime));
        }

        // Mark as attempting to prevent duplicate calls
        hasAttemptedTracking.current = true;
        setIsTracking(true);

        console.log(`📊 Tracking view for post ${postId}`);

        // Call the server-side tracking endpoint
        const response = await axios.post(`${API_BASE_URL}/api/blog/track-view`, {
          postId: postId // Send UUID as string, not number
        }, {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true // Include cookies if needed
        });

        if (response.data.success) {
          setViewRecorded(response.data.viewRecorded);

          if (response.data.viewRecorded) {
            console.log(`✅ View recorded successfully for post ${postId}`);
          } else {
            console.log(`ℹ️ View already counted (within 24-hour cooldown): ${response.data.message}`);
          }
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('❌ Error tracking blog view:', error.message);
          if (error.response) {
            console.error('Response error:', error.response.data);
          }
        } else {
          console.error('❌ Unexpected error tracking view:', error);
        }
      } finally {
        setIsTracking(false);
      }
    };

    // Start tracking
    trackView();

    // Cleanup function
    return () => {
      // Nothing to cleanup with server-side tracking
    };
  }, [postId, isTracking]);

  return {
    viewRecorded,
    isTracking
  };
}
