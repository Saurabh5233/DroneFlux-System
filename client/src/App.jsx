import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Homepage from './components/Homepage';
import LandingPage from './components/LandingPage'; // Import the new LandingPage
import Auth from './components/auth/Auth';
import GoogleLoginCallback from './components/auth/GoogleLoginCallback';
import AdminDashboard from './components/admin/AdminDashboard';
import CustomerDashboard from './components/customer/CustomerDashboard';
import LoadingSpinner from './components/ui/LoadingSpinner';

function App() {
  // Forcing a new build to clear Vercel cache
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Routes>
        <Route path="/" element={<LandingPage />} /> {/* Set LandingPage as the default route */}
        <Route path="/home" element={<Homepage />} /> {/* Move Homepage to /home */}
        <Route path="/auth/:role" element={<Auth />} />
        <Route path="/auth/google/callback" element={<GoogleLoginCallback />} />
        <Route 
          path="/admin/*" 
          element={
            user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" replace />
          } 
        />
        <Route 
          path="/customer/*" 
          element={
            user?.role === 'customer' ? <CustomerDashboard /> : <Navigate to="/" replace />
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;