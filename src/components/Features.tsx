import React from 'react';
import { Shield, Zap, Globe, Users, Coins, Lock, MessageSquare, Bot, Lightbulb, Palette } from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: Lightbulb,
      title: 'Universal Creativity Capture',
      description: 'Record ideas, jokes, stories, visual art, music, and any form of creative expression in one platform.',
      gradient: 'from-yellow-500 to-orange-500',
    },
    {
      icon: Bot,
      title: 'AI Creativity Validation',
      description: 'Advanced AI analyzes all content types to score creativity, identify patterns, and suggest improvements.',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: MessageSquare,
      title: 'Creative Chat Rooms',
      description: 'Real-time conversations where AI validates creative discussions and identifies collaboration opportunities.',
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      icon: Users,
      title: 'Meeting Integration Bots',
      description: 'Deploy AI bots to meetings that capture creative moments, analyze discussions, and generate insights.',
      gradient: 'from-green-500 to-teal-500',
    },
    {
      icon: Shield,
      title: 'Blockchain Ownership',
      description: 'Every creative work is secured on blockchain, ensuring permanent ownership and authenticity verification.',
      gradient: 'from-indigo-500 to-purple-500',
    },
    {
      icon: Coins,
      title: 'Multi-Format Monetization',
      description: 'Monetize any creative work - from viral jokes to innovative solutions through NFTs and direct sales.',
      gradient: 'from-red-500 to-pink-500',
    },
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Every Form of Creativity Matters
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            From breakthrough innovations to clever wordplay, from visual masterpieces to brilliant jokes - 
            Dewdrop captures, validates, and monetizes ALL forms of human creativity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-8 border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10">
                <div className={`w-14 h-14 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-4 group-hover:text-gray-900 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Creativity Examples */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">What Can You Create?</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="text-2xl mb-3">💡</div>
              <h4 className="font-semibold text-gray-800 mb-2">Ideas & Solutions</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Government policy ideas</li>
                <li>• Business innovations</li>
                <li>• Social solutions</li>
                <li>• Technical breakthroughs</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="text-2xl mb-3">😄</div>
              <h4 className="font-semibold text-gray-800 mb-2">Humor & Entertainment</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Clever jokes & puns</li>
                <li>• Funny observations</li>
                <li>• Comedic stories</li>
                <li>• Meme concepts</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="text-2xl mb-3">🎨</div>
              <h4 className="font-semibold text-gray-800 mb-2">Visual & Audio Art</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Digital artwork</li>
                <li>• Music compositions</li>
                <li>• Photography</li>
                <li>• Design concepts</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="text-2xl mb-3">✍️</div>
              <h4 className="font-semibold text-gray-800 mb-2">Writing & Language</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Poetry & prose</li>
                <li>• New word formations</li>
                <li>• Creative phrases</li>
                <li>• Storytelling</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <button className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-full hover:from-blue-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium text-lg">
            <span>Start Creating Anything</span>
            <Zap className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Features;