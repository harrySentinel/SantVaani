
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Suspense } from "react";
import { LoadingPage } from "@/components/ui/loading-spinner";
import { lazy } from "react";

// Lazy load pages for better code splitting
const Index = lazy(() => import("./pages/Index"));
const Saints = lazy(() => import("./pages/saints/index"));
const LivingSaints = lazy(() => import("./pages/living-saints/index"));
const Divine = lazy(() => import("./pages/divine/index"));
const Bhajans = lazy(() => import("./pages/bhajans/index"));
const LiveBhajan = lazy(() => import("./pages/live-bhajans/index"));
const Donation = lazy(() => import("./pages/donation/index"));
const About = lazy(() => import("./pages/about/index"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
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
              <Route path="/donation" element={<Donation />} />
              <Route path="/about" element={<About />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
