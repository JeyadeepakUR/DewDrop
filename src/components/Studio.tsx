import React, { useState } from 'react';
import { Mic, Video, Pause, Square, Play, Volume2, Settings, PenTool, Camera, Lightbulb, Type } from 'lucide-react';

const Studio: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'audio' | 'visual' | 'text' | 'idea'>('idea');
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [textContent, setTextContent] = useState('');

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    setIsPaused(false);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    setRecordingTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const modes = [
    { id: 'idea', label: 'Ideas & Thoughts', icon: Lightbulb, color: 'yellow' },
    { id: 'text', label: 'Writing & Stories', icon: Type, color: 'blue' },
    { id: 'audio', label: 'Audio & Music', icon: Mic, color: 'green' },
    { id: 'visual', label: 'Visual Art', icon: Camera, color: 'purple' }
  ];

  return (
    <section id="studio" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Universal Creative Studio
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Express your creativity in any form. From brilliant ideas to beautiful art, from clever jokes to innovative solutions.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Mode Selection */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {modes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setActiveMode(mode.id as any)}
                className={`flex items-center space-x-3 px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                  activeMode === mode.id
                    ? `bg-${mode.color}-500 text-white shadow-lg`
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
                }`}
              >
                <mode.icon className="w-5 h-5" />
                <span>{mode.label}</span>
              </button>
            ))}
          </div>

          <div className="bg-white rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
            {/* Studio Header */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <h3 className="text-lg font-semibold">Dewdrop Creative Studio</h3>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-300">
                    {isRecording ? (
                      <span className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span>Creating {formatTime(recordingTime)}</span>
                      </span>
                    ) : (
                      'Ready to Create'
                    )}
                  </div>
                  <Settings className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="p-8">
              {activeMode === 'idea' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                      <Lightbulb className="w-5 h-5 text-yellow-600" />
                      <span>Capture Your Ideas</span>
                    </h4>
                    <textarea
                      value={textContent}
                      onChange={(e) => setTextContent(e.target.value)}
                      placeholder="Share your brilliant idea, innovative solution, or creative thought..."
                      className="w-full h-40 p-4 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h5 className="font-medium text-blue-800 mb-2">💡 Innovation</h5>
                      <p className="text-sm text-blue-700">New solutions, breakthrough concepts, technical innovations</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <h5 className="font-medium text-green-800 mb-2">🏛️ Policy Ideas</h5>
                      <p className="text-sm text-green-700">Government schemes, social solutions, public initiatives</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <h5 className="font-medium text-purple-800 mb-2">🚀 Business</h5>
                      <p className="text-sm text-purple-700">Startup ideas, business models, market solutions</p>
                    </div>
                  </div>
                </div>
              )}

              {activeMode === 'text' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                      <Type className="w-5 h-5 text-blue-600" />
                      <span>Write Your Story</span>
                    </h4>
                    <textarea
                      value={textContent}
                      onChange={(e) => setTextContent(e.target.value)}
                      placeholder="Write a story, poem, joke, or create new phrases and wordplay..."
                      className="w-full h-40 p-4 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
                      <h5 className="font-medium text-pink-800 mb-2">😄 Humor</h5>
                      <p className="text-sm text-pink-700">Jokes, puns, funny observations</p>
                    </div>
                    <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                      <h5 className="font-medium text-indigo-800 mb-2">📖 Stories</h5>
                      <p className="text-sm text-indigo-700">Short stories, narratives, fiction</p>
                    </div>
                    <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
                      <h5 className="font-medium text-teal-800 mb-2">🎭 Poetry</h5>
                      <p className="text-sm text-teal-700">Poems, verses, lyrical content</p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                      <h5 className="font-medium text-orange-800 mb-2">🔤 Wordplay</h5>
                      <p className="text-sm text-orange-700">New phrases, word formations</p>
                    </div>
                  </div>
                </div>
              )}

              {activeMode === 'audio' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                      <Mic className="w-5 h-5 text-green-600" />
                      <span>Audio Creation</span>
                    </h4>
                    <div className="h-32 bg-gray-800 rounded-lg flex items-center justify-center relative overflow-hidden">
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: 50 }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-1 bg-gradient-to-t from-green-500 to-emerald-400 rounded-full transition-all duration-300 ${
                              isRecording && !isPaused ? 'animate-pulse' : ''
                            }`}
                            style={{
                              height: `${Math.random() * 60 + 20}px`,
                              animationDelay: `${i * 50}ms`,
                            }}
                          ></div>
                        ))}
                      </div>
                      {!isRecording && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-gray-500 text-center">
                            <Volume2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Start recording to see waveform</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeMode === 'visual' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                      <Camera className="w-5 h-5 text-purple-600" />
                      <span>Visual Creation</span>
                    </h4>
                    <div className="border-2 border-dashed border-purple-300 rounded-lg p-8 text-center">
                      <Camera className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">Upload your visual creation or take a photo</p>
                      <button className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                        Choose File
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Controls */}
              <div className="mt-8 flex items-center justify-center space-x-6">
                {(activeMode === 'audio') && (
                  <>
                    <button
                      onClick={toggleRecording}
                      className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${
                        isRecording
                          ? 'bg-red-500 hover:bg-red-600 text-white'
                          : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                      } shadow-lg`}
                    >
                      {isRecording ? <Square className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                    </button>

                    {isRecording && (
                      <button
                        onClick={togglePause}
                        className="w-12 h-12 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg"
                      >
                        {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                      </button>
                    )}
                  </>
                )}

                {(activeMode === 'idea' || activeMode === 'text') && (
                  <button
                    disabled={!textContent.trim()}
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg font-medium"
                  >
                    Validate Creativity
                  </button>
                )}

                {activeMode === 'visual' && (
                  <button className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg font-medium">
                    Analyze & Mint
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Studio;