import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Statistics from "./pages/Statistics";
import About from "./pages/About";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Requisites from "./pages/Requisites";
import Terms from "./pages/Terms";
import Offer from "./pages/Offer";
import Rules from "./pages/Rules";
import Admin from "./pages/Admin";
import Leaderboard from "./pages/Leaderboard";
import Support from "./pages/Support";
import Referrals from "./pages/Referrals";
import Achievements from "./pages/Achievements";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/requisites" element={<Requisites />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/offer" element={<Offer />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/support" element={<Support />} />
          <Route path="/referrals" element={<Referrals />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/about" element={<About />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
