import React from 'react';
import { Heart, MessageCircle, Share2, Play, User, Lightbulb, Palette, Type, Music, Zap } from 'lucide-react';

const Community: React.FC = () => {
  const creations = [
    {
      id: 1,
      title: 'Empathy Glasses AR Concept',
      creator: 'Alex Chen',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      thumbnail: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      type: 'Innovation',
      icon: Lightbulb,
      color: 'yellow',
      duration: 'Idea',
      likes: 2847,
      comments: 156,
      shares: 89,
      isVerified: true,
      creativityScore: 9.2,
      description: 'AR glasses that display floating emotion indicators above people\'s heads'
    },
    {
      id: 2,
      title: 'The Procaffeinating Chronicles',
      creator: 'Maya Rodriguez',
      avatar: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      thumbnail: 'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      type: 'Writing',
      icon: Type,
      color: 'blue',
      duration: '5 min read',
      likes: 1956,
      comments: 203,
      shares: 145,
      isVerified: true,
      creativityScore: 8.7,
      description: 'A hilarious collection of coffee-dependent productivity stories'
    },
    {
      id: 3,
      title: 'Quantum Joke Generator',
      creator: 'Jordan Kim',
      avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      thumbnail: 'https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      type: 'Humor',
      icon: Zap,
      color: 'pink',
      duration: '😄',
      likes: 3421,
      comments: 312,
      shares: 198,
      isVerified: false,
      creativityScore: 8.9,
      description: 'Why did the quantum physicist tell jokes? Because they wanted to split atoms... of laughter!'
    },
    {
      id: 4,
      title: 'Neon Dreams Soundscape',
      creator: 'Sam Taylor',
      avatar: 'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      thumbnail: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      type: 'Music',
      icon: Music,
      color: 'green',
      duration: '4:12',
      likes: 1643,
      comments: 87,
      shares: 76,
      isVerified: true,
      creativityScore: 8.4,
      description: 'Cyberpunk-inspired ambient music with synthesized city sounds'
    },
    {
      id: 5,
      title: 'Emotional Color Theory',
      creator: 'Riley Park',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      thumbnail: 'https://images.pexels.com/photos/1183986/pexels-photo-1183986.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      type: 'Visual Art',
      icon: Palette,
      color: 'purple',
      duration: 'Gallery',
      likes: 2198,
      comments: 134,
      shares: 92,
      isVerified: false,
      creativityScore: 8.6,
      description: 'Digital art series exploring how colors can represent complex emotions'
    },
    {
      id: 6,
      title: 'Universal Basic Creativity',
      creator: 'Avery Liu',
      avatar: 'https://images.pexels.com/photos/1819483/pexels-photo-1819483.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      thumbnail: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      type: 'Policy Idea',
      icon: Lightbulb,
      color: 'indigo',
      duration: 'Proposal',
      likes: 4567,
      comments: 423,
      shares: 267,
      isVerified: true,
      creativityScore: 9.5,
      description: 'Government program to fund creative pursuits as essential human development'
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      yellow: 'bg-yellow-100 text-yellow-800',
      blue: 'bg-blue-100 text-blue-800',
      pink: 'bg-pink-100 text-pink-800',
      green: 'bg-green-100 text-green-800',
      purple: 'bg-purple-100 text-purple-800',
      indigo: 'bg-indigo-100 text-indigo-800'
    };
    return colors[color as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <section id="community" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Discover All Forms of Creativity
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Explore the vibrant community where every creative spark is celebrated - from breakthrough innovations 
            to clever jokes, from beautiful art to brilliant policy ideas.
          </p>
        </div>

        {/* Creativity Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {[
            { label: 'All', icon: '✨', active: true },
            { label: 'Innovation', icon: '💡' },
            { label: 'Humor', icon: '😄' },
            { label: 'Art', icon: '🎨' },
            { label: 'Music', icon: '🎵' },
            { label: 'Writing', icon: '📝' },
            { label: 'Ideas', icon: '🚀' }
          ].map((category, index) => (
            <button
              key={index}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all ${
                category.active
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.label}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {creations.map((creation) => (
            <div
              key={creation.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200"
            >
              <div className="relative">
                <img
                  src={creation.thumbnail}
                  alt={creation.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                
                <div className="absolute top-4 left-4">
                  <span className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getColorClasses(creation.color)}`}>
                    <creation.icon className="w-3 h-3" />
                    <span>{creation.type}</span>
                  </span>
                </div>
                
                <div className="absolute top-4 right-4">
                  <span className="px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-sm rounded">
                    {creation.duration}
                  </span>
                </div>

                <div className="absolute bottom-4 right-4">
                  <div className="flex items-center space-x-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs font-medium text-gray-800">{creation.creativityScore}/10</span>
                  </div>
                </div>
                
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg">
                    <Play className="w-6 h-6 text-gray-800 ml-1" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                  {creation.title}
                </h3>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {creation.description}
                </p>
                
                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={creation.avatar}
                    alt={creation.creator}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex items-center space-x-1">
                    <span className="text-sm text-gray-600">{creation.creator}</span>
                    {creation.isVerified && (
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 hover:text-red-500 cursor-pointer transition-colors">
                      <Heart className="w-4 h-4" />
                      <span>{creation.likes.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1 hover:text-blue-500 cursor-pointer transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      <span>{creation.comments}</span>
                    </div>
                    <div className="flex items-center space-x-1 hover:text-green-500 cursor-pointer transition-colors">
                      <Share2 className="w-4 h-4" />
                      <span>{creation.shares}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium text-lg">
            <User className="w-5 h-5" />
            <span>Join the Creative Community</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Community;