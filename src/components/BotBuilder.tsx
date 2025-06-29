import React, { useState } from 'react';
import { Bot, Zap, Settings, Play, Save, Share2, Code, MessageSquare, Mic, Video, Brain } from 'lucide-react';

interface BotConfig {
  name: string;
  personality: string;
  capabilities: string[];
  meetingIntegration: boolean;
  creativityAnalysis: boolean;
  voiceEnabled: boolean;
  customPrompt: string;
}

const BotBuilder: React.FC = () => {
  const [activeTab, setActiveTab] = useState('builder');
  const [botConfig, setBotConfig] = useState<BotConfig>({
    name: 'Creative Assistant',
    personality: 'encouraging',
    capabilities: ['content_analysis', 'idea_generation'],
    meetingIntegration: true,
    creativityAnalysis: true,
    voiceEnabled: false,
    customPrompt: ''
  });

  const [isDeploying, setIsDeploying] = useState(false);
  const [deployedBots] = useState([
    {
      id: '1',
      name: 'Melody Mentor',
      status: 'active',
      meetings: 23,
      insights: 156,
      created: '2 days ago'
    },
    {
      id: '2',
      name: 'Idea Catalyst',
      status: 'active',
      meetings: 45,
      insights: 289,
      created: '1 week ago'
    },
    {
      id: '3',
      name: 'Feedback Friend',
      status: 'paused',
      meetings: 12,
      insights: 78,
      created: '3 days ago'
    }
  ]);

  const personalities = [
    { id: 'encouraging', name: 'Encouraging', description: 'Supportive and motivating' },
    { id: 'analytical', name: 'Analytical', description: 'Data-driven and precise' },
    { id: 'creative', name: 'Creative', description: 'Imaginative and inspiring' },
    { id: 'professional', name: 'Professional', description: 'Formal and structured' },
    { id: 'friendly', name: 'Friendly', description: 'Casual and approachable' }
  ];

  const capabilities = [
    { id: 'content_analysis', name: 'Content Analysis', description: 'Analyze creative content for quality and originality' },
    { id: 'idea_generation', name: 'Idea Generation', description: 'Generate creative ideas and suggestions' },
    { id: 'feedback_provision', name: 'Feedback Provision', description: 'Provide constructive feedback on creative work' },
    { id: 'collaboration_facilitation', name: 'Collaboration Facilitation', description: 'Help coordinate team creative projects' },
    { id: 'trend_analysis', name: 'Trend Analysis', description: 'Identify and analyze creative trends' },
    { id: 'skill_assessment', name: 'Skill Assessment', description: 'Evaluate and track creative skill development' }
  ];

  const deployBot = async () => {
    setIsDeploying(true);
    // Simulate deployment
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsDeploying(false);
  };

  const testBot = () => {
    // Simulate bot testing
    alert(`Testing ${botConfig.name} with ${botConfig.personality} personality...`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            AI Bot Builder
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Create intelligent bots that can join meetings, analyze creativity, and provide real-time insights to enhance collaborative sessions.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white rounded-lg p-1 mb-8 shadow-sm border border-gray-200">
          {[
            { id: 'builder', label: 'Bot Builder', icon: Bot },
            { id: 'deployed', label: 'My Bots', icon: Settings },
            { id: 'templates', label: 'Templates', icon: Code }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'builder' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Configuration Panel */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Settings */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Basic Configuration</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bot Name</label>
                    <input
                      type="text"
                      value={botConfig.name}
                      onChange={(e) => setBotConfig({...botConfig, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter bot name..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Personality</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {personalities.map((personality) => (
                        <label key={personality.id} className="relative">
                          <input
                            type="radio"
                            name="personality"
                            value={personality.id}
                            checked={botConfig.personality === personality.id}
                            onChange={(e) => setBotConfig({...botConfig, personality: e.target.value})}
                            className="sr-only"
                          />
                          <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            botConfig.personality === personality.id
                              ? 'border-indigo-500 bg-indigo-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}>
                            <div className="font-medium text-gray-900">{personality.name}</div>
                            <div className="text-sm text-gray-600">{personality.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Capabilities */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Capabilities</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {capabilities.map((capability) => (
                    <label key={capability.id} className="relative">
                      <input
                        type="checkbox"
                        checked={botConfig.capabilities.includes(capability.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setBotConfig({
                              ...botConfig,
                              capabilities: [...botConfig.capabilities, capability.id]
                            });
                          } else {
                            setBotConfig({
                              ...botConfig,
                              capabilities: botConfig.capabilities.filter(c => c !== capability.id)
                            });
                          }
                        }}
                        className="sr-only"
                      />
                      <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        botConfig.capabilities.includes(capability.id)
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <div className="font-medium text-gray-900">{capability.name}</div>
                        <div className="text-sm text-gray-600">{capability.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Advanced Settings */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Advanced Settings</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Meeting Integration</h4>
                      <p className="text-sm text-gray-600">Allow bot to join video meetings</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={botConfig.meetingIntegration}
                        onChange={(e) => setBotConfig({...botConfig, meetingIntegration: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Creativity Analysis</h4>
                      <p className="text-sm text-gray-600">Analyze conversations for creative insights</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={botConfig.creativityAnalysis}
                        onChange={(e) => setBotConfig({...botConfig, creativityAnalysis: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Voice Enabled</h4>
                      <p className="text-sm text-gray-600">Enable voice interactions</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={botConfig.voiceEnabled}
                        onChange={(e) => setBotConfig({...botConfig, voiceEnabled: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Custom Prompt (Optional)</label>
                    <textarea
                      value={botConfig.customPrompt}
                      onChange={(e) => setBotConfig({...botConfig, customPrompt: e.target.value})}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Add custom instructions for your bot..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Panel */}
            <div className="space-y-6">
              {/* Bot Preview */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Bot Preview</h3>
                
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 mb-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{botConfig.name}</h4>
                      <p className="text-sm text-gray-600 capitalize">{botConfig.personality} personality</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Brain className="w-4 h-4 text-indigo-500" />
                      <span className="text-sm text-gray-700">{botConfig.capabilities.length} capabilities enabled</span>
                    </div>
                    {botConfig.meetingIntegration && (
                      <div className="flex items-center space-x-2">
                        <Video className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-700">Meeting integration active</span>
                      </div>
                    )}
                    {botConfig.voiceEnabled && (
                      <div className="flex items-center space-x-2">
                        <Mic className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-gray-700">Voice interactions enabled</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={testBot}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    <span>Test Bot</span>
                  </button>
                  
                  <button
                    onClick={deployBot}
                    disabled={isDeploying}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg transition-all disabled:opacity-50"
                  >
                    {isDeploying ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Deploying...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        <span>Deploy Bot</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Integration Guide */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Integration Guide</h3>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Zoom Integration</h4>
                    <p className="text-sm text-gray-600 mb-2">Add bot to Zoom meetings via webhook</p>
                    <code className="text-xs bg-gray-200 px-2 py-1 rounded">
                      POST /api/v1/bots/{'{bot_id}'}/join-meeting
                    </code>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Teams Integration</h4>
                    <p className="text-sm text-gray-600 mb-2">Deploy as Teams app</p>
                    <code className="text-xs bg-gray-200 px-2 py-1 rounded">
                      manifest.json available after deployment
                    </code>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Custom Integration</h4>
                    <p className="text-sm text-gray-600 mb-2">Use REST API for custom platforms</p>
                    <code className="text-xs bg-gray-200 px-2 py-1 rounded">
                      API docs available in dashboard
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'deployed' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Deployed Bots</h3>
              <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors">
                <Bot className="w-4 h-4" />
                <span>Create New Bot</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {deployedBots.map((bot) => (
                <div key={bot.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">{bot.name}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      bot.status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {bot.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Meetings joined:</span>
                      <span className="font-medium">{bot.meetings}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Insights generated:</span>
                      <span className="font-medium">{bot.insights}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Created:</span>
                      <span className="font-medium">{bot.created}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm">
                      <Settings className="w-4 h-4 mx-auto" />
                    </button>
                    <button className="flex-1 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors text-sm">
                      <Share2 className="w-4 h-4 mx-auto" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Bot Templates</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: 'Creative Mentor',
                  description: 'Provides guidance and feedback on creative projects',
                  capabilities: ['feedback_provision', 'skill_assessment'],
                  popular: true
                },
                {
                  name: 'Idea Generator',
                  description: 'Generates creative ideas and brainstorming prompts',
                  capabilities: ['idea_generation', 'trend_analysis'],
                  popular: false
                },
                {
                  name: 'Collaboration Facilitator',
                  description: 'Helps coordinate team creative sessions',
                  capabilities: ['collaboration_facilitation', 'content_analysis'],
                  popular: true
                },
                {
                  name: 'Content Analyzer',
                  description: 'Analyzes creative content for quality and originality',
                  capabilities: ['content_analysis', 'trend_analysis'],
                  popular: false
                }
              ].map((template, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow relative">
                  {template.popular && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-2 py-1 rounded-full">
                      Popular
                    </div>
                  )}
                  
                  <h4 className="font-semibold text-gray-900 mb-2">{template.name}</h4>
                  <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {template.capabilities.map((capability, capIndex) => (
                      <span key={capIndex} className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded">
                        {capability.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                  
                  <button className="w-full px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors">
                    Use Template
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BotBuilder;