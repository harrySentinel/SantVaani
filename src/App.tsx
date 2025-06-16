
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Saints from "./pages/saints/index";
import LivingSaints from "./pages/living-saints/index";
import Divine from "./pages/divine/index";
import Bhajans from "./pages/bhajans/index";
import Donation from "./pages/donation/index";
import About from "./pages/about/index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/saints" element={<Saints />} />
          <Route path="/living-saints" element={<LivingSaints />} />
          <Route path="/divine" element={<Divine />} />
          <Route path="/bhajans" element={<Bhajans />} />
          <Route path="/donation" element={<Donation />} />
          <Route path="/about" element={<About />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
