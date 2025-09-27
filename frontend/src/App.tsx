
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Suspense, useEffect } from "react";
import { LoadingPage } from "@/components/ui/loading-spinner";
import { lazy } from "react";
import { getFCMToken, onFCMMessage } from "@/lib/firebase";
import { AuthProvider } from "@/contexts/AuthContext";

// Lazy load pages for better code splitting
const Index = lazy(() => import("./pages/Index"));
const Saints = lazy(() => import("./pages/saints/index"));
const LivingSaints = lazy(() => import("./pages/living-saints/index"));
const Divine = lazy(() => import("./pages/divine/index"));
const Bhajans = lazy(() => import("./pages/bhajans/index"));
const LiveBhajan = lazy(() => import("./pages/live-bhajans/index"));
const DailyGuide = lazy(() => import("./pages/daily-guide/index"));
const Horoscope = lazy(() => import("./pages/horoscope/index"));
const Events = lazy(() => import("./pages/events/index"));
const Donation = lazy(() => import("./pages/donation/index"));
const About = lazy(() => import("./pages/about/index"));
const Login = lazy(() => import("./pages/auth/login"));
const Signup = lazy(() => import("./pages/auth/signup"));
const ResetPassword = lazy(() => import("./pages/auth/reset-password"));
const Dashboard = lazy(() => import("./pages/dashboard/index"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Initialize Firebase FCM on app load
    const initializeFCM = async () => {
      console.log('🔥 Initializing Firebase FCM...');
      
      // Firebase automatically registers firebase-messaging-sw.js
      // No need to manually register service worker
      
      // Request FCM token
      const token = await getFCMToken();
      if (token) {
        console.log('✅ FCM initialized successfully');
      }
      
      // Listen for foreground messages
      onFCMMessage((payload) => {
        console.log('📱 Received foreground message:', payload);
        // You can show toast notifications here
      });
    };

    initializeFCM();
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
          <Suspense fallback={<LoadingPage text="Loading SantVaani..." />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/saints" element={<Saints />} />
              <Route path="/living-saints" element={<LivingSaints />} />
              <Route path="/divine" element={<Divine />} />
              <Route path="/bhajans" element={<Bhajans />} />
               <Route path="/live-bhajan" element={<LiveBhajan />} />
              <Route path="/daily-guide" element={<DailyGuide />} />
              <Route path="/horoscope" element={<Horoscope />} />
              <Route path="/events" element={<Events />} />
              <Route path="/donation" element={<Donation />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/dashboard" element={<Dashboard />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
