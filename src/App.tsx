
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/browse" element={<BrowseAudio />} />
              <Route path="/audio/:id" element={<AudioDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/register/success" element={<RegisterSuccess />} />
            </Route>
            
            {/* Artist Routes */}
            <Route path="/artist" element={<AppLayout />}>
              <Route path="dashboard" element={<ArtistDashboard />} />
              {/* Additional artist routes would go here */}
            </Route>
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AppLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              {/* Additional admin routes would go here */}
            </Route>
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
