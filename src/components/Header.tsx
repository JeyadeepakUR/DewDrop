import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Music, Menu, X, Zap, User, Bot, MessageSquare, Code } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                <Music className="w-4 h-4 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              Dewdrop
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              Features
            </a>
            <Link to="/studio" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              Studio
            </Link>
            <Link to="/api" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              API
            </Link>
            <Link to="/chat" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              Chat
            </Link>
            <Link to="/bots" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              Bots
            </Link>
            <a href="#community" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              Community
            </a>
            <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              Dashboard
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/dashboard" className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors font-medium">
              <User className="w-4 h-4" />
              <span>Sign In</span>
            </Link>
            <Link to="/studio" className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-full hover:from-blue-600 hover:to-teal-600 transition-all duration-200 transform hover:scale-105 font-medium">
              <Zap className="w-4 h-4" />
              <span>Start Creating</span>
            </Link>
          </div>

          <button
            className="md:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4 bg-white/90 backdrop-blur-sm rounded-b-lg border-t border-gray-200/20">
            <a href="#features" className="block px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors font-medium">
              Features
            </a>
            <Link to="/studio" className="block px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors font-medium">
              Studio
            </Link>
            <Link to="/api" className="block px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors font-medium">
              API
            </Link>
            <Link to="/chat" className="block px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors font-medium">
              Chat
            </Link>
            <Link to="/bots" className="block px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors font-medium">
              Bots
            </Link>
            <a href="#community" className="block px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors font-medium">
              Community
            </a>
            <Link to="/dashboard" className="block px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors font-medium">
              Dashboard
            </Link>
            <div className="px-4 pt-4 space-y-2">
              <Link to="/dashboard" className="block w-full px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors font-medium border border-gray-200 rounded-lg text-center">
                Sign In
              </Link>
              <Link to="/studio" className="block w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg hover:from-blue-600 hover:to-teal-600 transition-all duration-200 font-medium text-center">
                Start Creating
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;