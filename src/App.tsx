import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

import MainLayout from './layouts/MainLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Community from './pages/Community';
import Scanner from './pages/Scanner';
import Chatbot from './pages/Chatbot';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Splash from './pages/Splash';
import Onboarding from './pages/Onboarding';
import { useAuthStore } from './store/useAuthStore';

// Protected Route Wrapper Component
function ProtectedRoute({ children }: { children: React.JSX.Element }) {
  const { isAuthenticated, checkAuth } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [location.pathname]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

// Redirect Route Wrapper for Auth (e.g. login/register) to prevent logged-in users from seeing them
function AuthRoute({ children }: { children: React.JSX.Element }) {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

// Check for onboarding status
function OnboardingRoute({ children }: { children: React.JSX.Element }) {
  const onboardingCompleted = localStorage.getItem('agrinex_onboarding_completed') === 'true';
  if (onboardingCompleted) {
    return <Navigate to="/welcome" replace />;
  }
  return children;
}

function AppRoutes() {
  const location = useLocation();
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        
        {/* Splash and Onboarding */}
        <Route path="/" element={<Splash />} />
        <Route path="/onboarding" element={<OnboardingRoute><Onboarding /></OnboardingRoute>} />
        <Route path="/welcome" element={<AuthRoute><Landing /></AuthRoute>} />
        
        {/* Auth routes */}
        <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
        <Route path="/register" element={<AuthRoute><Signup /></AuthRoute>} />
        
        {/* Protected Dashboard Routes */}
        <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="scan" element={<Scanner />} />
          <Route path="chat" element={<Chatbot />} />
          <Route path="community" element={<Community />} />
          <Route path="profile" element={<Profile />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <div className="bg-bgMain min-h-screen font-sans w-full relative">
        <AppRoutes />
      </div>
    </Router>
  );
}
