import React, { useState, useEffect } from 'react';
import { Bell, User, Menu, X, Lightbulb, MessageSquare, Code, Bot, BarChart3, Settings, LogOut, AlertCircle, Database } from 'lucide-react';
import ChatRoom from './ChatRoom';
import StudioPage from './StudioPage';
import APIPage from './APIPage';
import BotBuilder from './BotBuilder';
import Dashboard from './Dashboard';
import ProfilePage from './ProfilePage';
import NotificationPanel from './NotificationPanel';
import DatabaseStatus from './DatabaseStatus';

const MainApp: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('chat');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'nft_eligible',
      title: 'NFT Opportunity Available!',
      message: 'Your "Quantum Joke Generator" scored 9.2/10 and is eligible for NFT minting.',
      timestamp: new Date(Date.now() - 300000),
      read: false
    },
    {
      id: '2',
      type: 'revenue_opportunity',
      title: 'Monetization Ready',
      message: 'Your creative content can now generate ad revenue. Apply for public publishing.',
      timestamp: new Date(Date.now() - 600000),
      read: false
    }
  ]);

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

  useEffect(() => {
    const loadUser = async () => {
      const supabaseConfigured = isSupabaseConfigured();
      
      if (!supabaseConfigured) {
        // Set a mock user when Supabase is not configured
        setUser({
          id: 'demo-user',
          email: 'demo@dewdrop.io',
          username: 'Demo User'
        });
        return;
      }

      try {
        const { authService } = await import('../services/auth');
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        } else {
          // If no user found, redirect to home
          window.location.href = '/';
        }
      } catch (error) {
        console.error('Failed to load user:', error);
        window.location.href = '/';
      }
    };

    loadUser();
  }, []);

  const handleLogout = async () => {
    try {
      if (isSupabaseConfigured()) {
        const { authService } = await import('../services/auth');
        await authService.signOut();
      }
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
      // Force redirect even if logout fails
      window.location.href = '/';
    }
  };

  const menuItems = [
    { id: 'chat', label: 'Creative Chat', icon: MessageSquare, description: 'Real-time creative conversations' },
    { id: 'studio', label: 'Create', icon: Lightbulb, description: 'Record and create content' },
    { id: 'api', label: 'API Hub', icon: Code, description: 'Developer tools and APIs' },
    { id: 'bots', label: 'Meeting Bots', icon: Bot, description: 'AI bots for meetings' },
    { id: 'dashboard', label: 'Analytics', icon: BarChart3, description: 'Performance insights' },
    { id: 'database', label: 'Database Status', icon: Database, description: 'Check database integration' },
    { id: 'settings', label: 'Settings', icon: Settings, description: 'Account preferences' }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;
  const supabaseConfigured = isSupabaseConfigured();

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'chat':
        return <ChatRoom />;
      case 'studio':
        return <StudioPage />;
      case 'api':
        return <APIPage />;
      case 'bots':
        return <BotBuilder />;
      case 'dashboard':
        return <Dashboard />;
      case 'database':
        return <DatabaseStatus />;
      default:
        return <ChatRoom />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:relative inset-y-0 left-0 z-50 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Dewdrop
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Database Status Warning */}
          {!supabaseConfigured && (
            <div className="mx-4 mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-xs text-yellow-800 font-medium">Demo Mode</p>
                  <p className="text-xs text-yellow-700">Database not configured</p>
                  <button
                    onClick={() => setCurrentPage('database')}
                    className="text-xs text-yellow-800 underline hover:text-yellow-900 mt-1"
                  >
                    Check Status
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* User Info */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {user?.email?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">
                  {user?.username || user?.email?.split('@')[0] || 'Creative User'}
                </h3>
                <p className="text-sm text-gray-600">
                  {supabaseConfigured ? 'Creativity Score: 8.7/10' : 'Demo User'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  currentPage === item.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium">{item.label}</div>
                  <div className={`text-xs ${currentPage === item.id ? 'text-blue-100' : 'text-gray-500'}`}>
                    {item.description}
                  </div>
                </div>
              </button>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">{supabaseConfigured ? 'Sign Out' : 'Exit Demo'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900 capitalize">
              {currentPage === 'chat' ? 'Creative Chat' : 
               currentPage === 'database' ? 'Database Status' :
               menuItems.find(item => item.id === currentPage)?.label}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Database Status Indicator */}
            <button
              onClick={() => setCurrentPage('database')}
              className={`p-2 rounded-lg transition-colors ${
                supabaseConfigured 
                  ? 'text-green-600 hover:bg-green-50' 
                  : 'text-yellow-600 hover:bg-yellow-50'
              }`}
              title={supabaseConfigured ? 'Database Connected' : 'Database Not Configured'}
            >
              <Database className="w-5 h-5" />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              
              {showNotifications && (
                <NotificationPanel
                  notifications={notifications}
                  onClose={() => setShowNotifications(false)}
                  onMarkAsRead={(id) => {
                    setNotifications(prev => prev.map(n => 
                      n.id === id ? { ...n, read: true } : n
                    ));
                  }}
                />
              )}
            </div>

            {/* Profile */}
            {currentPage !== 'profile' && (
              <button
                onClick={() => setShowProfile(true)}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <User className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1">
          {showProfile ? (
            <ProfilePage onClose={() => setShowProfile(false)} />
          ) : (
            renderCurrentPage()
          )}
        </div>
      </div>
    </div>
  );
};

export default MainApp;