import React, { useState } from 'react';
import { X, User, Award, TrendingUp, DollarSign, Eye, Youtube, Globe, Twitter, Linkedin } from 'lucide-react';

interface ProfilePageProps {
  onClose: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const creativityScores = {
    humor: 8.7,
    literary: 7.9,
    artistic: 8.2,
    innovation: 9.1,
    musical: 7.5
  };

  const publishedWorks = [
    {
      id: '1',
      title: 'The Procaffeinating Chronicles',
      platform: 'Medium',
      type: 'Article',
      views: 15420,
      revenue: 234.50,
      publishedAt: '2024-01-15'
    },
    {
      id: '2',
      title: 'Quantum Jokes Collection',
      platform: 'YouTube',
      type: 'Video',
      views: 89340,
      revenue: 1250.75,
      publishedAt: '2024-01-10'
    },
    {
      id: '3',
      title: 'Empathy Glasses: AR Innovation',
      platform: 'Personal Blog',
      type: 'Article',
      views: 5670,
      revenue: 89.25,
      publishedAt: '2024-01-08'
    }
  ];

  const totalViews = publishedWorks.reduce((sum, work) => sum + work.views, 0);
  const totalRevenue = publishedWorks.reduce((sum, work) => sum + work.revenue, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
          <div className="flex items-start space-x-6">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white text-3xl font-bold">U</span>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Creative User</h2>
              <p className="text-gray-600 mb-4">Universal Creator • Joined January 2024</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{totalViews.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Views</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">${totalRevenue.toFixed(2)}</div>
                  <div className="text-sm text-gray-600">Total Revenue</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">8.5</div>
                  <div className="text-sm text-gray-600">Avg Creativity</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{publishedWorks.length}</div>
                  <div className="text-sm text-gray-600">Published Works</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'creativity', label: 'Creativity Scores' },
            { id: 'published', label: 'Published Works' },
            { id: 'revenue', label: 'Revenue Dashboard' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-800">Published "Quantum Jokes Collection" on YouTube</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-800">Creativity score of 9.2 achieved in chat</p>
                    <p className="text-xs text-gray-500">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-800">NFT eligibility notification received</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Connected Platforms */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Connected Platforms</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Youtube className="w-5 h-5 text-red-600" />
                    <span className="font-medium text-gray-800">YouTube</span>
                  </div>
                  <span className="text-sm text-green-600">Connected</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-gray-800">Medium</span>
                  </div>
                  <span className="text-sm text-green-600">Connected</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Twitter className="w-5 h-5 text-blue-500" />
                    <span className="font-medium text-gray-800">Twitter</span>
                  </div>
                  <button className="text-sm text-blue-600 hover:text-blue-800">Connect</button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Linkedin className="w-5 h-5 text-blue-700" />
                    <span className="font-medium text-gray-800">LinkedIn</span>
                  </div>
                  <button className="text-sm text-blue-600 hover:text-blue-800">Connect</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'creativity' && (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Creativity Scores by Category</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(creativityScores).map(([category, score]) => (
                <div key={category} className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-800 capitalize">{category}</h4>
                    <Award className="w-5 h-5 text-yellow-500" />
                  </div>
                  
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-blue-600 mb-1">{score}/10</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${score * 10}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 text-center">
                    {score >= 9 ? 'Exceptional' : score >= 8 ? 'Excellent' : score >= 7 ? 'Good' : 'Developing'}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">🎯 Improvement Suggestions</h4>
              <ul className="space-y-1 text-sm text-blue-700">
                <li>• Focus on musical creativity to reach 8.0+ score</li>
                <li>• Your innovation score is exceptional - consider applying for patents</li>
                <li>• Humor content performs well - explore comedy writing opportunities</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'published' && (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Published Creative Works</h3>
            
            <div className="space-y-4">
              {publishedWorks.map((work) => (
                <div key={work.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{work.title}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center space-x-1">
                          <Globe className="w-4 h-4" />
                          <span>{work.platform}</span>
                        </span>
                        <span>{work.type}</span>
                        <span>Published {new Date(work.publishedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{work.views.toLocaleString()} views</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-green-600">${work.revenue.toFixed(2)} earned</span>
                        </div>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors text-sm font-medium">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'revenue' && (
          <div className="space-y-8">
            {/* Revenue Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-800">Total Revenue</h4>
                  <DollarSign className="w-5 h-5 text-green-500" />
                </div>
                <div className="text-2xl font-bold text-green-600 mb-1">${totalRevenue.toFixed(2)}</div>
                <div className="text-sm text-gray-600">All time earnings</div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-800">This Month</h4>
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                </div>
                <div className="text-2xl font-bold text-blue-600 mb-1">$456.30</div>
                <div className="text-sm text-green-600">+23% from last month</div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-800">Avg per Work</h4>
                  <Eye className="w-5 h-5 text-purple-500" />
                </div>
                <div className="text-2xl font-bold text-purple-600 mb-1">${(totalRevenue / publishedWorks.length).toFixed(2)}</div>
                <div className="text-sm text-gray-600">Revenue per publication</div>
              </div>
            </div>

            {/* Revenue Breakdown */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Revenue by Platform</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Youtube className="w-5 h-5 text-red-600" />
                    <span className="font-medium text-gray-800">YouTube</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">$1,250.75</div>
                    <div className="text-sm text-gray-600">81% of total</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-gray-800">Medium</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">$234.50</div>
                    <div className="text-sm text-gray-600">15% of total</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-800">Personal Blog</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">$89.25</div>
                    <div className="text-sm text-gray-600">4% of total</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;