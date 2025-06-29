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
  const [supabaseConfigured, setSupabaseConfigured] = useState(false);

  useEffect(() => {
    const checkSupabaseConfig = () => {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      return supabaseUrl && 
             supabaseKey && 
             supabaseUrl !== 'https://placeholder.supabase.co' && 
             supabaseKey !== 'placeholder-key' &&
             supabaseUrl.includes('supabase.co');
    };

    const checkAuth = async () => {
      try {
        const isConfigured = checkSupabaseConfig();
        setSupabaseConfigured(isConfigured);

        if (!isConfigured) {
          // If Supabase is not configured, skip auth check and show landing page
          console.log('Supabase not configured, showing landing page');
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        // Only check auth if Supabase is configured
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

    // Only set up auth listeners if Supabase is configured
    if (checkSupabaseConfig()) {
      // Listen for auth state changes from Supabase
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (event === 'SIGNED_IN' && session?.user) {
          // User signed in
          try {
            const user = await authService.getCurrentUser();
            setIsAuthenticated(!!user);
          } catch (error) {
            console.error('Error getting user after sign in:', error);
            setIsAuthenticated(false);
          }
        } else if (event === 'SIGNED_OUT' || !session) {
          // User signed out or session expired
          setIsAuthenticated(false);
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          // Token was refreshed, ensure user is still valid
          try {
            const user = await authService.getCurrentUser();
            setIsAuthenticated(!!user);
          } catch (error) {
            console.error('Error getting user after token refresh:', error);
            setIsAuthenticated(false);
          }
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
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Dewdrop...</p>
          {!supabaseConfigured && (
            <p className="text-sm text-gray-500 mt-2">
              Note: Database not configured - running in demo mode
            </p>
          )}
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
            <AuthPage 
              onAuthSuccess={() => setIsAuthenticated(true)} 
              supabaseConfigured={supabaseConfigured}
            />
          ) : (
            <Navigate to="/home" replace />
          )} 
        />
        <Route 
          path="/home" 
          element={isAuthenticated ? (
            <MainApp supabaseConfigured={supabaseConfigured} />
          ) : (
            <Navigate to="/" replace />
          )} 
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