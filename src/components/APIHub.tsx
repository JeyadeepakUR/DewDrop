import React, { useState } from 'react';
import { Code, Key, Book, Zap, Copy, CheckCircle, ExternalLink, Settings, Shield } from 'lucide-react';

const APIHub: React.FC = () => {
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
      path: '/api/v1/content/upload',
      description: 'Upload and process creative content',
      params: ['file', 'title', 'description', 'tags[]']
    },
    {
      method: 'GET',
      path: '/api/v1/content/{id}',
      description: 'Retrieve content details and metadata',
      params: ['id']
    },
    {
      method: 'POST',
      path: '/api/v1/ai/enhance',
      description: 'Apply AI enhancement to content',
      params: ['content_id', 'enhancement_type']
    },
    {
      method: 'POST',
      path: '/api/v1/bots/create',
      description: 'Create a new bot for meeting integration',
      params: ['name', 'personality', 'capabilities[]']
    },
    {
      method: 'GET',
      path: '/api/v1/analytics/creativity',
      description: 'Get creativity validation scores',
      params: ['user_id', 'timeframe']
    }
  ];

  const sdks = [
    {
      name: 'JavaScript/Node.js',
      install: 'npm install @dewdrop/sdk',
      example: `import { DewdropAPI } from '@dewdrop/sdk';

const dewdrop = new DewdropAPI('${apiKey}');

// Upload content
const result = await dewdrop.content.upload({
  file: audioFile,
  title: 'My Creation',
  autoEnhance: true
});`
    },
    {
      name: 'Python',
      install: 'pip install dewdrop-sdk',
      example: `from dewdrop import DewdropAPI

dewdrop = DewdropAPI('${apiKey}')

# Create a meeting bot
bot = dewdrop.bots.create(
    name="Creative Assistant",
    personality="encouraging",
    capabilities=["content_analysis", "idea_generation"]
)`
    },
    {
      name: 'cURL',
      install: 'No installation required',
      example: `curl -X POST https://api.dewdrop.io/v1/content/upload \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: multipart/form-data" \\
  -F "file=@audio.mp3" \\
  -F "title=My Creation"`
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Dewdrop API Hub
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Integrate Dewdrop's creative AI and blockchain features into your applications. Build bots, analyze creativity, and enhance content programmatically.
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
            { id: 'sdks', label: 'SDKs', icon: Zap },
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
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">AI Enhancement</h4>
                  <p className="text-gray-600">Automatically enhance audio, generate tags, and improve content quality using our AI models.</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Blockchain Integration</h4>
                  <p className="text-gray-600">Mint NFTs, verify ownership, and manage digital rights through our Web3 infrastructure.</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Bot Creation</h4>
                  <p className="text-gray-600">Build intelligent bots that can join meetings, analyze creativity, and provide real-time feedback.</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Rate Limits</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">1,000</div>
                    <div className="text-sm text-gray-600">Requests per hour</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">100MB</div>
                    <div className="text-sm text-gray-600">Max file size</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">99.9%</div>
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

          {activeTab === 'sdks' && (
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">SDKs & Code Examples</h3>
              
              <div className="space-y-8">
                {sdks.map((sdk, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-semibold text-gray-900">{sdk.name}</h4>
                        <code className="text-sm bg-gray-200 px-3 py-1 rounded">{sdk.install}</code>
                      </div>
                    </div>
                    <div className="p-6">
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                        <code>{sdk.example}</code>
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'webhooks' && (
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Webhooks</h3>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <div className="flex items-center space-x-3 mb-3">
                  <Settings className="w-5 h-5 text-blue-600" />
                  <h4 className="text-lg font-semibold text-blue-900">Webhook Configuration</h4>
                </div>
                <p className="text-blue-800">
                  Configure webhooks to receive real-time notifications about content processing, AI analysis results, and creativity validation scores.
                </p>
              </div>

              <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Available Events</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      'content.uploaded',
                      'content.processed',
                      'ai.enhancement.completed',
                      'creativity.validated',
                      'bot.created',
                      'meeting.analyzed'
                    ].map((event, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <code className="text-sm text-gray-800">{event}</code>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Webhook URL</h4>
                  <div className="flex items-center space-x-4">
                    <input
                      type="url"
                      placeholder="https://your-app.com/webhooks/dewdrop"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                      Save
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

export default APIHub;