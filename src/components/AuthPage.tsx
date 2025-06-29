import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Wallet, Shield, ArrowLeft, AlertCircle } from 'lucide-react';

interface AuthPageProps {
  onAuthSuccess: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const [authMethod, setAuthMethod] = useState<'web3' | 'gmail' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Check if Supabase is configured
  const isSupabaseConfigured = () => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    return supabaseUrl && 
           supabaseKey && 
           supabaseUrl !== 'https://placeholder.supabase.co' && 
           supabaseKey !== 'placeholder-key' &&
           supabaseUrl.includes('supabase.co');
  };

  const validatePassword = (password: string): string | null => {
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    return null;
  };

  const handleWeb3Auth = async () => {
    if (!isSupabaseConfigured()) {
      setError('Database not configured. Web3 authentication requires a database connection.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const { web3Service } = await import('../services/web3');
      const result = await web3Service.connectWallet();
      if (result.success && result.account) {
        const { authService } = await import('../services/auth');
        const authResult = await authService.signInWithWallet(result.account);
        if (authResult.error) {
          setError(authResult.error.message || 'Failed to authenticate with wallet');
        } else {
          onAuthSuccess();
          navigate('/home');
        }
      } else {
        setError(result.error || 'Failed to connect wallet');
      }
    } catch (err) {
      setError('Web3 authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isSupabaseConfigured()) {
      setError('Database not configured. Email authentication requires a database connection.');
      return;
    }

    setLoading(true);
    setError('');

    // Validate password
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    try {
      const { authService } = await import('../services/auth');
      
      if (isSignUp) {
        const result = await authService.signUp(email, password, email.split('@')[0]);
        if (result.error) {
          setError(result.error.message || 'Failed to create account');
        } else {
          // For demo purposes, immediately sign them in
          setTimeout(() => {
            onAuthSuccess();
            navigate('/home');
          }, 1000);
        }
      } else {
        const result = await authService.signIn(email, password);
        if (result.error) {
          // Handle specific error cases
          if (result.error.message?.includes('Invalid login credentials')) {
            setError('Invalid email or password. Please check your credentials and try again.');
          } else if (result.error.message?.includes('Email not confirmed')) {
            setError('Please check your email and click the confirmation link before signing in.');
          } else {
            setError(result.error.message || 'Failed to sign in');
          }
        } else {
          onAuthSuccess();
          navigate('/home');
        }
      }
    } catch (err) {
      setError('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Demo mode - allow bypassing auth for demonstration
  const handleDemoMode = () => {
    onAuthSuccess();
    navigate('/home');
  };

  const supabaseConfigured = isSupabaseConfigured();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/40 p-8">
          {/* Logo */}
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Dewdrop
            </span>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Join the Creative Revolution</h2>
            <p className="text-gray-600">Choose your preferred authentication method</p>
          </div>

          {/* Database Configuration Warning */}
          {!supabaseConfigured && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800 mb-1">Database Not Configured</h4>
                  <p className="text-sm text-yellow-700 mb-3">
                    To use authentication features, please set up your Supabase database connection. 
                    You can still explore the demo features.
                  </p>
                  <button
                    onClick={handleDemoMode}
                    className="text-sm bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1 rounded-md transition-colors"
                  >
                    Continue in Demo Mode
                  </button>
                </div>
              </div>
            </div>
          )}

          {!authMethod ? (
            <div className="space-y-4">
              {/* Web3 Authentication */}
              <button
                onClick={() => setAuthMethod('web3')}
                disabled={!supabaseConfigured}
                className={`w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg ${
                  supabaseConfigured
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Wallet className="w-5 h-5" />
                <span className="font-medium">Connect Web3 Wallet</span>
              </button>

              {/* Gmail Authentication */}
              <button
                onClick={() => setAuthMethod('gmail')}
                disabled={!supabaseConfigured}
                className={`w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                  supabaseConfigured
                    ? 'bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-gray-300'
                    : 'bg-gray-100 text-gray-500 border-2 border-gray-200 cursor-not-allowed'
                }`}
              >
                <Mail className="w-5 h-5" />
                <span className="font-medium">Continue with Email</span>
              </button>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800 mb-1">Why Authentication?</h4>
                    <p className="text-sm text-blue-700">
                      We verify users to maintain a safe creative environment and prevent spam or inappropriate content in our community chats.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : authMethod === 'web3' ? (
            <div className="space-y-6">
              <div className="text-center">
                <Wallet className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Connect Your Wallet</h3>
                <p className="text-gray-600 mb-6">
                  Connect your Web3 wallet for secure, decentralized authentication
                </p>
              </div>

              <button
                onClick={handleWeb3Auth}
                disabled={loading}
                className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 disabled:opacity-50 text-white rounded-xl transition-all duration-300 font-medium"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <Wallet className="w-5 h-5" />
                    <span>Connect MetaMask</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setAuthMethod(null)}
                className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Choose Different Method
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <Mail className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {isSignUp ? 'Join the creative community' : 'Welcome back to Dewdrop'}
                </p>
              </div>

              <form onSubmit={handleGmailAuth} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password {isSignUp && <span className="text-gray-500">(minimum 6 characters)</span>}
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="••••••••"
                    minLength={6}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 disabled:opacity-50 text-white rounded-xl transition-all duration-300 font-medium"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{isSignUp ? 'Creating Account...' : 'Signing In...'}</span>
                    </>
                  ) : (
                    <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                  )}
                </button>
              </form>

              <div className="text-center">
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                </button>
              </div>

              <button
                onClick={() => setAuthMethod(null)}
                className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Choose Different Method
              </button>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;