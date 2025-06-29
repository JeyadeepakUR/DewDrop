import React, { useState, useRef, useEffect } from 'react';
import { Send, Users, Sparkles, Bot, Mic, MicOff, Volume2, VolumeX, Settings, Lightbulb, Palette, Type, Music } from 'lucide-react';

interface Message {
  id: string;
  user: string;
  content: string;
  timestamp: Date;
  type: 'user' | 'ai' | 'system';
  creativityScore?: number;
  creativityType?: 'innovation' | 'humor' | 'artistic' | 'linguistic' | 'musical';
}

const ChatRoom: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      user: 'AI Moderator',
      content: 'Welcome to the Dewdrop Creative Lounge! Share ANY form of creativity - ideas, jokes, art, music, stories, or innovative solutions. Our AI validates all creative expressions in real-time.',
      timestamp: new Date(Date.now() - 300000),
      type: 'ai'
    },
    {
      id: '2',
      user: 'Alex Chen',
      content: 'Just had this crazy idea: What if we created "empathy glasses" that show floating emotion indicators above people\'s heads in AR? Could revolutionize social interactions!',
      timestamp: new Date(Date.now() - 240000),
      type: 'user',
      creativityScore: 9.2,
      creativityType: 'innovation'
    },
    {
      id: '3',
      user: 'Maya Rodriguez',
      content: 'Why don\'t scientists trust atoms? Because they make up everything! 😄 But seriously, that AR idea is brilliant Alex!',
      timestamp: new Date(Date.now() - 180000),
      type: 'user',
      creativityScore: 7.8,
      creativityType: 'humor'
    },
    {
      id: '4',
      user: 'Jordan Kim',
      content: 'I just coined a new word: "Procaffeinating" - the tendency to not start anything until you\'ve had your coffee. Should be in the dictionary!',
      timestamp: new Date(Date.now() - 120000),
      type: 'user',
      creativityScore: 8.5,
      creativityType: 'linguistic'
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [activeUsers] = useState(127);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      // Determine creativity type based on content
      let creativityType: Message['creativityType'] = 'innovation';
      const content = newMessage.toLowerCase();
      
      if (content.includes('joke') || content.includes('funny') || content.includes('😄') || content.includes('haha')) {
        creativityType = 'humor';
      } else if (content.includes('art') || content.includes('design') || content.includes('visual') || content.includes('color')) {
        creativityType = 'artistic';
      } else if (content.includes('word') || content.includes('phrase') || content.includes('language') || content.includes('story')) {
        creativityType = 'linguistic';
      } else if (content.includes('music') || content.includes('sound') || content.includes('song') || content.includes('rhythm')) {
        creativityType = 'musical';
      }

      const message: Message = {
        id: Date.now().toString(),
        user: 'You',
        content: newMessage,
        timestamp: new Date(),
        type: 'user',
        creativityScore: Math.random() * 10,
        creativityType
      };
      
      setMessages(prev => [...prev, message]);
      setNewMessage('');

      // Simulate AI response based on creativity score
      setTimeout(() => {
        if (message.creativityScore && message.creativityScore > 7) {
          const responses = {
            innovation: `Brilliant innovation! Your idea scored ${message.creativityScore.toFixed(1)}/10. This could disrupt entire industries!`,
            humor: `Excellent humor! Scored ${message.creativityScore.toFixed(1)}/10 on our comedy index. You should consider stand-up!`,
            artistic: `Beautiful artistic vision! ${message.creativityScore.toFixed(1)}/10 creativity score. Your aesthetic sense is remarkable!`,
            linguistic: `Fantastic wordplay! ${message.creativityScore.toFixed(1)}/10 for linguistic creativity. You're expanding language itself!`,
            musical: `Amazing musical concept! ${message.creativityScore.toFixed(1)}/10 for sonic innovation. This could be the next big sound!`
          };

          const aiResponse: Message = {
            id: (Date.now() + 1).toString(),
            user: 'AI Moderator',
            content: responses[message.creativityType || 'innovation'],
            timestamp: new Date(),
            type: 'ai'
          };
          setMessages(prev => [...prev, aiResponse]);
        }
      }, 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getCreativityColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-100';
    if (score >= 6) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getCreativityIcon = (type?: Message['creativityType']) => {
    switch (type) {
      case 'innovation': return <Lightbulb className="w-3 h-3" />;
      case 'humor': return <span className="text-xs">😄</span>;
      case 'artistic': return <Palette className="w-3 h-3" />;
      case 'linguistic': return <Type className="w-3 h-3" />;
      case 'musical': return <Music className="w-3 h-3" />;
      default: return <Sparkles className="w-3 h-3" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 pt-20 pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Universal Creative Lounge
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Share ANY form of creativity - from breakthrough innovations to clever jokes, from beautiful art to brilliant wordplay. 
            Our AI validates and celebrates all creative expressions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 flex flex-col h-[600px]">
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 text-white rounded-t-2xl flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">All-Forms Creative Chat</h3>
                      <p className="text-purple-100 text-sm">Ideas • Humor • Art • Music • Stories • Innovation</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span className="font-medium text-sm">{activeUsers} creators online</span>
                    </div>
                    <Settings className="w-4 h-4 cursor-pointer hover:text-purple-200 transition-colors" />
                  </div>
                </div>
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.user === 'You' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md ${
                      message.type === 'ai' 
                        ? 'bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200' 
                        : message.user === 'You'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white border border-gray-200'
                    } rounded-2xl p-4 shadow-sm`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {message.type === 'ai' && <Bot className="w-4 h-4 text-purple-600" />}
                          <span className={`text-sm font-medium ${
                            message.user === 'You' ? 'text-blue-100' : 'text-gray-600'
                          }`}>
                            {message.user}
                          </span>
                        </div>
                        <span className={`text-xs ${
                          message.user === 'You' ? 'text-blue-200' : 'text-gray-500'
                        }`}>
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                      <p className={`${message.user === 'You' ? 'text-white' : 'text-gray-800'} leading-relaxed`}>
                        {message.content}
                      </p>
                      {message.creativityScore && (
                        <div className="mt-3 flex items-center space-x-2">
                          {getCreativityIcon(message.creativityType)}
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getCreativityColor(message.creativityScore)}`}>
                            {message.creativityType}: {message.creativityScore.toFixed(1)}/10
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="border-t border-gray-200 p-4 bg-white rounded-b-2xl flex-shrink-0">
                <div className="mb-2">
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span className="flex items-center space-x-1">
                      <Lightbulb className="w-3 h-3" />
                      <span>Ideas</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span>😄</span>
                      <span>Humor</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Palette className="w-3 h-3" />
                      <span>Art</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Type className="w-3 h-3" />
                      <span>Writing</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Music className="w-3 h-3" />
                      <span>Music</span>
                    </span>
                  </div>
                </div>
                <div className="flex items-end space-x-3">
                  <div className="flex-1">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Share any creative idea, joke, story, innovation, or artistic thought..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none transition-all"
                      rows={2}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsRecording(!isRecording)}
                      className={`p-3 rounded-full transition-all transform hover:scale-105 ${
                        isRecording 
                          ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                      }`}
                    >
                      {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full transition-all transform hover:scale-105 shadow-lg"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Insights */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">AI Creativity Insights</h3>
                  <p className="text-sm text-gray-600">Live analysis of all creative forms</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-green-800">Innovation Spike</span>
                    <span className="text-xs text-green-600">1 min ago</span>
                  </div>
                  <p className="text-sm text-green-700">
                    AR empathy glasses concept shows breakthrough potential
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-yellow-800">Linguistic Creativity</span>
                    <span className="text-xs text-yellow-600">3 min ago</span>
                  </div>
                  <p className="text-sm text-yellow-700">
                    New word "Procaffeinating" detected - high originality score
                  </p>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-blue-800">Collaboration Potential</span>
                    <span className="text-xs text-blue-600">5 min ago</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Multiple creators interested in AR/VR innovation
                  </p>
                </div>
              </div>
            </div>

            {/* Active Creators by Type */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Active Creators</h3>
              <div className="space-y-3">
                {[
                  { name: 'Alex Chen', type: 'Innovation', icon: '💡', status: 'Ideating' },
                  { name: 'Maya Rodriguez', type: 'Humor', icon: '😄', status: 'Joking' },
                  { name: 'Jordan Kim', type: 'Language', icon: '📝', status: 'Wordsmithing' },
                  { name: 'Sam Taylor', type: 'Music', icon: '🎵', status: 'Composing' },
                  { name: 'Riley Park', type: 'Visual', icon: '🎨', status: 'Designing' }
                ].map((user, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm">
                      {user.icon}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.type} • {user.status}</div>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Creativity Stats */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Today's Creativity</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">💡 Innovations</span>
                  <span className="font-medium">47</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">😄 Jokes Shared</span>
                  <span className="font-medium">123</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">🎨 Art Pieces</span>
                  <span className="font-medium">89</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">📝 Stories Written</span>
                  <span className="font-medium">34</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">🎵 Music Created</span>
                  <span className="font-medium">67</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;