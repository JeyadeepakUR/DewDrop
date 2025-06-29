import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Sparkles, Users, Shield, Lightbulb, Palette, PenTool } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-teal-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/40 mb-6">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium text-gray-700">Universal Creativity Platform</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent leading-tight">
            Every Creative
            <br />
            Spark Matters
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            Welcome to Dewdrop, where ALL creativity thrives. From brilliant jokes to groundbreaking ideas, 
            from visual masterpieces to innovative solutions - capture, validate, and monetize every form of human creativity.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link to="/studio" className="group flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-full hover:from-blue-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium text-lg">
            <Lightbulb className="w-5 h-5 group-hover:animate-pulse" />
            <span>Start Creating</span>
          </Link>
          
          <Link to="/chat" className="flex items-center space-x-3 px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-700 rounded-full hover:bg-white/90 transition-all duration-300 border border-white/40 hover:border-white/60 font-medium text-lg">
            <Users className="w-5 h-5" />
            <span>Join Creative Chat</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/40 hover:bg-white/70 transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <PenTool className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Ideas & Writing</h3>
            <p className="text-gray-600 text-sm">Capture thoughts, stories, jokes, and innovative concepts</p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/40 hover:bg-white/70 transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Visual Art</h3>
            <p className="text-gray-600 text-sm">Share drawings, designs, photos, and visual creativity</p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/40 hover:bg-white/70 transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <Play className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Audio & Music</h3>
            <p className="text-gray-600 text-sm">Record music, sounds, podcasts, and audio creativity</p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/40 hover:bg-white/70 transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">AI Validation</h3>
            <p className="text-gray-600 text-sm">Get real-time creativity scores and insights</p>
          </div>
        </div>

        <div className="mt-12 bg-white/40 backdrop-blur-sm rounded-2xl p-8 border border-white/40">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">What Makes Something Creative?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">💡 Innovation</h4>
              <p className="text-gray-600 text-sm">New solutions, fresh perspectives, breakthrough ideas</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">😄 Humor & Joy</h4>
              <p className="text-gray-600 text-sm">Clever jokes, wordplay, entertaining content</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">🎨 Artistic Expression</h4>
              <p className="text-gray-600 text-sm">Visual beauty, emotional resonance, unique style</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;