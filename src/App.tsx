
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { useTrafficTracking } from "@/hooks/useTrafficTracking";
import AutoLoginPopup from "@/components/AutoLoginPopup";
import RealTimeStats from "@/components/RealTimeStats";
import Index from "./pages/Index";
import About from "./pages/About";
import Categories from "./pages/Categories";
import SubmitNews from "./pages/SubmitNews";
import ArticleDetail from "./pages/ArticleDetail";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import AccountSettings from "./pages/AccountSettings";
import PrivacySettings from "./pages/PrivacySettings";
import EmailPreferences from "./pages/EmailPreferences";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  useTrafficTracking();
  
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<About />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/submit-news" element={<SubmitNews />} />
      <Route path="/article/:id" element={<ArticleDetail />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/account-settings" element={<AccountSettings />} />
      <Route path="/privacy-settings" element={<PrivacySettings />} />
      <Route path="/email-preferences" element={<EmailPreferences />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
          <AutoLoginPopup />
          <RealTimeStats />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
