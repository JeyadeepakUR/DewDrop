import React, { useState } from 'react';
import { Code, Key, Book, Zap, Copy, CheckCircle, ExternalLink, Settings, Shield, Bot } from 'lucide-react';

const APIPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [copiedKey, setCopiedKey] = useState(false);

  const apiKey = 'dw_sk_1234567890abcdef1234567890abcdef';

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const endpoints = [
    {
      method: 'POST',
      path: '/api/v1/creativity/analyze',
      description: 'Analyze any content for creativity score and insights',
      params: ['content', 'type', 'context']
    },
    {
      method: 'POST',
      path: '/api/v1/bots/deploy',
      description: 'Deploy AI bot to meeting platforms',
      params: ['bot_config', 'meeting_url', 'capabilities[]']
    },
    {
      method: 'GET',
      path: '/api/v1/chat/insights',
      description: 'Get real-time creativity insights from chat rooms',
      params: ['room_id', 'timeframe']
    },
    {
      method: 'POST',
      path: '/api/v1/content/validate',
      description: 'Validate content for NFT eligibility and monetization',
      params: ['content_id', 'validation_type']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Dewdrop API Hub
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Integrate universal creativity validation, meeting bots, and content analysis into your applications.
          </p>
        </div>

        {/* API Key Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Key className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Your API Key</h3>
                <p className="text-sm text-gray-600">Use this key to authenticate your requests</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">Active</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 bg-gray-50 rounded-lg p-4">
            <code className="flex-1 text-sm font-mono text-gray-800">{apiKey}</code>
            <button
              onClick={copyApiKey}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              {copiedKey ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedKey ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: Book },
            { id: 'endpoints', label: 'Endpoints', icon: Code },
            { id: 'bots', label: 'Meeting Bots', icon: Bot },
            { id: 'webhooks', label: 'Webhooks', icon: Settings }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {activeTab === 'overview' && (
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">API Overview</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Universal Creativity Analysis</h4>
                  <p className="text-gray-600">Analyze any content type - ideas, jokes, art, music - for creativity scores and insights.</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Meeting Bot Deployment</h4>
                  <p className="text-gray-600">Deploy AI bots to Zoom, Teams, or any meeting platform to capture creative moments.</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Content Validation</h4>
                  <p className="text-gray-600">Validate content for NFT eligibility, monetization potential, and IP protection.</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Rate Limits & Usage</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">10,000</div>
                    <div className="text-sm text-gray-600">API calls per month</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">100</div>
                    <div className="text-sm text-gray-600">Bot deployments</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">Real-time</div>
                    <div className="text-sm text-gray-600">Analysis speed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">99.9%</div>
                    <div className="text-sm text-gray-600">Uptime SLA</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'endpoints' && (
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">API Endpoints</h3>
              
              <div className="space-y-6">
                {endpoints.map((endpoint, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        endpoint.method === 'GET' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {endpoint.method}
                      </span>
                      <code className="text-lg font-mono text-gray-800">{endpoint.path}</code>
                    </div>
                    <p className="text-gray-600 mb-4">{endpoint.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {endpoint.params.map((param, paramIndex) => (
                        <span key={paramIndex} className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded">
                          {param}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'bots' && (
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Meeting Bot Integration</h3>
              
              <div className="space-y-8">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <Bot className="w-5 h-5 text-blue-600" />
                    <h4 className="text-lg font-semibold text-blue-900">Deploy Creativity Bots</h4>
                  </div>
                  <p className="text-blue-800 mb-4">
                    Deploy AI bots to any meeting platform to capture creative moments, analyze discussions, and provide real-time insights.
                  </p>
                  
                  <div className="bg-white rounded-lg p-4">
                    <h5 className="font-medium text-gray-800 mb-3">Example Bot Deployment</h5>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`curl -X POST https://api.dewdrop.io/v1/bots/deploy \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "bot_config": {
      "name": "Creative Insights Bot",
      "personality": "encouraging",
      "capabilities": ["creativity_analysis", "collaboration_detection"]
    },
    "meeting_url": "https://zoom.us/j/123456789",
    "auto_join": true
  }'`}
                    </pre>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Supported Platforms</h4>
                    <div className="space-y-3">
                      {[
                        { name: 'Zoom', status: 'Full Support', color: 'green' },
                        { name: 'Microsoft Teams', status: 'Full Support', color: 'green' },
                        { name: 'Google Meet', status: 'Beta', color: 'yellow' },
                        { name: 'Discord', status: 'Coming Soon', color: 'gray' }
                      ].map((platform, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="font-medium text-gray-800">{platform.name}</span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            platform.color === 'green' ? 'bg-green-100 text-green-800' :
                            platform.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {platform.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Bot Capabilities</h4>
                    <div className="space-y-2">
                      {[
                        'Real-time creativity analysis',
                        'Collaboration opportunity detection',
                        'Meeting summary generation',
                        'Action item extraction',
                        'Participant engagement tracking',
                        'Creative insight notifications'
                      ].map((capability, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">{capability}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'webhooks' && (
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Webhooks</h3>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <div className="flex items-center space-x-3 mb-3">
                  <Settings className="w-5 h-5 text-blue-600" />
                  <h4 className="text-lg font-semibold text-blue-900">Real-time Notifications</h4>
                </div>
                <p className="text-blue-800">
                  Receive instant notifications when creativity thresholds are met, bots generate insights, or content becomes eligible for monetization.
                </p>
              </div>

              <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Available Events</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      'creativity.high_score_detected',
                      'content.nft_eligible',
                      'bot.insight_generated',
                      'meeting.creativity_spike',
                      'content.monetization_ready',
                      'collaboration.opportunity_found'
                    ].map((event, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <code className="text-sm text-gray-800">{event}</code>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Webhook Configuration</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Webhook URL</label>
                      <input
                        type="url"
                        placeholder="https://your-app.com/webhooks/dewdrop"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Secret Key</label>
                      <input
                        type="password"
                        placeholder="webhook_secret_key"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <button className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                      Save Configuration
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Documentation Link */}
        <div className="mt-8 text-center">
          <a
            href="#"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <Book className="w-5 h-5" />
            <span>View Full Documentation</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default APIPage;