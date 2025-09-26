import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { HideOwnerHelper } from "@/components/HideOwnerHelper";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Statistics from "./pages/Statistics";
import About from "./pages/About";
import GameGuide from "./pages/GameGuide";
import Company from "./pages/Company";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Requisites from "./pages/Requisites";
import { Terms } from "./pages/Terms";
import { Offer } from "./pages/Offer";
import Rules from "./pages/Rules";
import TelegramAvatar from "./pages/TelegramAvatar";
import Admin from "./pages/Admin";
import AdminSupport from "./pages/AdminSupport";
import Leaderboard from "./pages/Leaderboard";
import Support from "./pages/Support";
import Referrals from "./pages/Referrals";
import Achievements from "./pages/Achievements";
import Careers from "./pages/Careers";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <HideOwnerHelper />
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
          <Route path="/terms" element={
            <ProtectedRoute pageKey="terms">
              <Terms />
            </ProtectedRoute>
          } />
          <Route path="/offer" element={
            <ProtectedRoute pageKey="offer">
              <Offer />
            </ProtectedRoute>
          } />
          <Route path="/rules" element={<Rules />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/support" element={<AdminSupport />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/support" element={<Support />} />
          <Route path="/referrals" element={<Referrals />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/about" element={<Company />} />
          <Route path="/guide" element={<GameGuide />} />
          <Route path="/telegram-avatar" element={<TelegramAvatar />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
