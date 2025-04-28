import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Layouts
import MainLayout from "./components/layout/MainLayout";
import AppLayout from "./components/layout/AppLayout";

// Public Pages
import Index from "./pages/Index";
import BrowseAudio from "./pages/BrowseAudio";
import AudioDetail from "./pages/AudioDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RegisterSuccess from "./pages/RegisterSuccess";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

// Artist Pages
import ArtistDashboard from "./pages/artist/Dashboard";
import ArtistProfile from "./pages/artist/Profile";
import ArtistAudios from "./pages/artist/Audios";
import ArtistCopyrights from "./pages/artist/Copyrights";
import ArtistLicenses from "./pages/artist/Licenses";
import ArtistPayments from "./pages/artist/Payments";
import ArtistSettings from "./pages/artist/Settings";
import UploadAudio from "./pages/artist/UploadAudio";
import RequestLicense from "./pages/artist/RequestLicense";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminArtists from "./pages/admin/Artists";
import AdminAudios from "./pages/admin/Audios";
import AdminVerifications from "./pages/admin/Verifications";
import AdminCopyrightRequests from "./pages/admin/CopyrightRequests";
import AdminSettings from "./pages/admin/Settings";
import AdminPayments from "./pages/admin/Payments";
import AdminApprovals from "./pages/admin/Approvals";
import UserManagement from "./pages/admin/UserManagement";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<MainLayout><Index /></MainLayout>} />
              <Route path="/about" element={<MainLayout><About /></MainLayout>} />
              <Route path="/browse" element={<MainLayout><BrowseAudio /></MainLayout>} />
              <Route path="/audio/:id" element={<MainLayout><AudioDetail /></MainLayout>} />
              <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
              <Route path="/register" element={<MainLayout><Register /></MainLayout>} />
              <Route path="/register-success" element={<MainLayout><RegisterSuccess /></MainLayout>} />
              
              {/* Artist Routes */}
              <Route path="/artist" element={<AppLayout><ArtistDashboard /></AppLayout>} />
              <Route path="/artist/dashboard" element={<AppLayout><ArtistDashboard /></AppLayout>} />
              <Route path="/artist/audios" element={<AppLayout><ArtistAudios /></AppLayout>} />
              <Route path="/artist/upload-audio" element={<AppLayout><UploadAudio /></AppLayout>} />
              <Route path="/artist/copyrights" element={<AppLayout><ArtistCopyrights /></AppLayout>} />
              <Route path="/artist/licenses" element={<AppLayout><ArtistLicenses /></AppLayout>} />
              <Route path="/artist/request-license" element={<AppLayout><RequestLicense /></AppLayout>} />
              <Route path="/artist/payments" element={<AppLayout><ArtistPayments /></AppLayout>} />
              <Route path="/artist/profile" element={<AppLayout><ArtistProfile /></AppLayout>} />
              <Route path="/artist/settings" element={<AppLayout><ArtistSettings /></AppLayout>} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AppLayout><AdminDashboard /></AppLayout>} />
              <Route path="/admin/dashboard" element={<AppLayout><AdminDashboard /></AppLayout>} />
              <Route path="/admin/artists" element={<AppLayout><AdminArtists /></AppLayout>} />
              <Route path="/admin/audios" element={<AppLayout><AdminAudios /></AppLayout>} />
              <Route path="/admin/copyright-requests" element={<AppLayout><AdminCopyrightRequests /></AppLayout>} />
              <Route path="/admin/approvals" element={<AppLayout><AdminApprovals /></AppLayout>} />
              <Route path="/admin/verifications" element={<AppLayout><AdminVerifications /></AppLayout>} />
              <Route path="/admin/payments" element={<AppLayout><AdminPayments /></AppLayout>} />
              <Route path="/admin/settings" element={<AppLayout><AdminSettings /></AppLayout>} />
              <Route path="/admin/user-management" element={<AppLayout><UserManagement /></AppLayout>} />
              
              <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
            </Routes>
          </Router>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
