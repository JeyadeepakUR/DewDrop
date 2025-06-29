import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import MainApp from './components/MainApp';
import { authService } from './services/auth';
import { supabase } from './services/supabase';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await authService.getCurrentUser();
        setIsAuthenticated(!!user);
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    // Initial auth check
    checkAuth();

    // Listen for auth state changes from Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (event === 'SIGNED_IN' && session?.user) {
        // User signed in
        const user = await authService.getCurrentUser();
        setIsAuthenticated(!!user);
      } else if (event === 'SIGNED_OUT' || !session) {
        // User signed out or session expired
        setIsAuthenticated(false);
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        // Token was refreshed, ensure user is still valid
        const user = await authService.getCurrentUser();
        setIsAuthenticated(!!user);
      }
    });

    // Listen for custom auth change events
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener('dewdrop-auth-change', handleAuthChange);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('dewdrop-auth-change', handleAuthChange);
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
          element={!isAuthenticated ? <AuthPage onAuthSuccess={() => setIsAuthenticated(true)} /> : <Navigate to="/home" replace />} 
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