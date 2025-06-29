import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import MainApp from './components/MainApp';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simple timeout to prevent endless loading
    const loadingTimeout = setTimeout(() => {
      console.log('Loading timeout reached, showing landing page');
      setLoading(false);
      setIsAuthenticated(false);
    }, 2000); // 2 second maximum loading time

    // Check if Supabase is configured
    const checkSupabaseConfig = () => {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      return supabaseUrl && 
             supabaseKey && 
             supabaseUrl !== 'https://placeholder.supabase.co' && 
             supabaseKey !== 'placeholder-key' &&
             supabaseUrl.includes('supabase.co');
    };

    const initializeApp = async () => {
      try {
        const isConfigured = checkSupabaseConfig();
        
        if (!isConfigured) {
          console.log('Supabase not configured, showing landing page');
          clearTimeout(loadingTimeout);
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        // If Supabase is configured, try to check auth
        const { authService } = await import('./services/auth');
        const user = await authService.getCurrentUser();
        
        clearTimeout(loadingTimeout);
        setIsAuthenticated(!!user);
        setLoading(false);
      } catch (error) {
        console.error('App initialization failed:', error);
        clearTimeout(loadingTimeout);
        setIsAuthenticated(false);
        setLoading(false);
      }
    };

    initializeApp();

    return () => {
      clearTimeout(loadingTimeout);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Dewdrop...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={!isAuthenticated ? <LandingPage /> : <Navigate to="/home" replace />} 
        />
        <Route 
          path="/auth" 
          element={!isAuthenticated ? (
            <AuthPage onAuthSuccess={() => setIsAuthenticated(true)} />
          ) : (
            <Navigate to="/home" replace />
          )} 
        />
        <Route 
          path="/home" 
          element={isAuthenticated ? <MainApp /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="*" 
          element={<Navigate to={isAuthenticated ? "/home" : "/"} replace />} 
        />
      </Routes>
    </Router>
  );
}

export default App;