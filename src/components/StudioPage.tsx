import React, { useState } from 'react';
import { Mic, Video, Camera, Type, Lightbulb, Upload, Zap, Save, Share2, CheckCircle, AlertCircle, X } from 'lucide-react';
import { llmService } from '../services/llm';

const StudioPage: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'idea' | 'text' | 'audio' | 'visual'>('idea');
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [creativityResult, setCreativityResult] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [submissionError, setSubmissionError] = useState('');

  // Check if Supabase is configured
  const isSupabaseConfigured = () => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    return supabaseUrl && 
           supabaseKey && 
           supabaseUrl !== 'https://placeholder.supabase.co' && 
           supabaseKey !== 'placeholder-key' &&
           supabaseUrl.includes('supabase.co');
  };

  const modes = [
    { id: 'idea', label: 'Ideas & Innovation', icon: Lightbulb, color: 'yellow', placeholder: 'Share your brilliant idea, innovative solution, or creative thought...' },
    { id: 'text', label: 'Writing & Stories', icon: Type, color: 'blue', placeholder: 'Write a story, poem, joke, or create new phrases and wordplay...' },
    { id: 'audio', label: 'Audio & Music', icon: Mic, color: 'green', placeholder: 'Record music, sounds, podcasts, or audio creativity...' },
    { id: 'visual', label: 'Visual Art', icon: Camera, color: 'purple', placeholder: 'Upload or capture visual creativity...' }
  ];

  const handleAnalyzeCreativity = async () => {
    if (!content.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const analysis = await llmService.analyzeCreativity(content);
      setCreativityResult(analysis);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const handleSubmitIdea = async () => {
    if (!content.trim() && !selectedFile) {
      setSubmissionError('Please provide either text content or upload a file');
      return;
    }

    if (!title.trim()) {
      setSubmissionError('Please provide a title for your creation');
      return;
    }

    setIsSubmitting(true);
    setSubmissionError('');
    setSubmissionSuccess(false);

    try {
      const supabaseConfigured = isSupabaseConfigured();
      
      if (!supabaseConfigured) {
        // Demo mode - simulate successful submission
        await new Promise(resolve => setTimeout(resolve, 2000));
        setSubmissionSuccess(true);
        setContent('');
        setTitle('');
        setSelectedFile(null);
        setCreativityResult(null);
        return;
      }

      // Real Supabase submission
      const { authService, contentService } = await import('../services/supabase');
      
      // Get current user
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      let fileUrl = '';
      
      // Upload file if present
      if (selectedFile) {
        const { data: uploadData, error: uploadError } = await contentService.uploadFile(selectedFile);
        if (uploadError) {
          throw new Error(`File upload failed: ${uploadError.message}`);
        }
        fileUrl = uploadData?.url || '';
      }

      // Determine content type based on mode and file
      let contentType: 'audio' | 'video' | 'mixed' = 'mixed';
      if (selectedFile) {
        if (selectedFile.type.startsWith('audio/')) {
          contentType = 'audio';
        } else if (selectedFile.type.startsWith('video/')) {
          contentType = 'video';
        }
      }

      // Generate AI tags if we have content
      let aiTags: string[] = [];
      if (content.trim()) {
        try {
          const tags = await import('../services/supabase').then(({ aiService }) => 
            aiService.generateTags(content, fileUrl)
          );
          aiTags = Array.isArray(tags) ? tags : [];
        } catch (error) {
          console.warn('AI tag generation failed:', error);
        }
      }

      // Create the creation object
      const creationData = {
        title: title.trim(),
        description: content.trim() || undefined,
        creator_id: currentUser.id,
        file_url: fileUrl || 'https://example.com/placeholder.mp3', // Placeholder for text-only content
        duration: 0, // Would be calculated for audio/video files
        type: contentType,
        tags: aiTags,
        is_nft: false,
        price: 0,
        currency: 'USD' as const,
        ai_generated_tags: aiTags,
        ai_enhancement_applied: false,
        creator: currentUser
      };

      // Submit to database
      const { data: creation, error: createError } = await contentService.createContent(creationData);
      
      if (createError) {
        throw new Error(`Failed to create content: ${createError.message}`);
      }

      // Success!
      setSubmissionSuccess(true);
      setContent('');
      setTitle('');
      setSelectedFile(null);
      setCreativityResult(null);

    } catch (error) {
      console.error('Submission failed:', error);
      setSubmissionError(error instanceof Error ? error.message : 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getColorClasses = (color: string) => {
    const colors = {
      yellow: 'from-yellow-500 to-orange-500',
      blue: 'from-blue-500 to-indigo-500',
      green: 'from-green-500 to-emerald-500',
      purple: 'from-purple-500 to-pink-500'
    };
    return colors[color as keyof typeof colors];
  };

  const currentMode = modes.find(m => m.id === activeMode)!;
  const supabaseConfigured = isSupabaseConfigured();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Universal Creative Studio</h1>
          <p className="text-gray-600">Express your creativity in any form - ideas, stories, art, music, and more</p>
          {!supabaseConfigured && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-yellow-600" />
                <p className="text-sm text-yellow-800">
                  <strong>Demo Mode:</strong> Submissions will be simulated. Connect your database to save real content.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Success Message */}
        {submissionSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <h4 className="font-medium text-green-800">Submission Successful!</h4>
                <p className="text-sm text-green-700">Your creative content has been saved and is now part of your portfolio.</p>
              </div>
              <button
                onClick={() => setSubmissionSuccess(false)}
                className="ml-auto text-green-600 hover:text-green-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {submissionError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div>
                <h4 className="font-medium text-red-800">Submission Failed</h4>
                <p className="text-sm text-red-700">{submissionError}</p>
              </div>
              <button
                onClick={() => setSubmissionError('')}
                className="ml-auto text-red-600 hover:text-red-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Mode Selection */}
        <div className="flex flex-wrap gap-4 mb-8">
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setActiveMode(mode.id as any)}
              className={`flex items-center space-x-3 px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                activeMode === mode.id
                  ? `bg-gradient-to-r ${getColorClasses(mode.color)} text-white shadow-lg`
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300 shadow-sm'
              }`}
            >
              <mode.icon className="w-5 h-5" />
              <span>{mode.label}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Creation Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              {/* Studio Header */}
              <div className={`bg-gradient-to-r ${getColorClasses(currentMode.color)} p-6 text-white`}>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <currentMode.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{currentMode.label}</h3>
                    <p className="text-white/80">Create and validate your {activeMode} content</p>
                  </div>
                </div>
              </div>

              {/* Content Creation Area */}
              <div className="p-8">
                {/* Title Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Give your creation a compelling title..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>

                {(activeMode === 'idea' || activeMode === 'text') && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content
                      </label>
                      <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={currentMode.placeholder}
                        className="w-full h-64 p-6 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-lg leading-relaxed"
                      />
                    </div>

                    {/* File Upload for Ideas/Text */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Supporting File (Optional)
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                        {selectedFile ? (
                          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center space-x-3">
                              <Upload className="w-5 h-5 text-gray-500" />
                              <div>
                                <p className="font-medium text-gray-900">{selectedFile.name}</p>
                                <p className="text-sm text-gray-500">
                                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={removeFile}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        ) : (
                          <div className="text-center">
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-600 mb-2">Upload an image, audio, or document</p>
                            <input
                              type="file"
                              onChange={handleFileSelect}
                              accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.txt"
                              className="hidden"
                              id="file-upload"
                            />
                            <label
                              htmlFor="file-upload"
                              className="cursor-pointer px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                            >
                              Choose File
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        {content.length} characters
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={handleAnalyzeCreativity}
                          disabled={!content.trim() || isAnalyzing}
                          className={`flex items-center space-x-2 px-4 py-2 bg-gradient-to-r ${getColorClasses(currentMode.color)} hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-300 font-medium`}
                        >
                          {isAnalyzing ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Analyzing...</span>
                            </>
                          ) : (
                            <>
                              <Zap className="w-4 h-4" />
                              <span>Analyze</span>
                            </>
                          )}
                        </button>
                        
                        <button
                          onClick={handleSubmitIdea}
                          disabled={(!content.trim() && !selectedFile) || !title.trim() || isSubmitting}
                          className="flex items-center space-x-2 px-6 py-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-300 font-medium"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Submitting...</span>
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4" />
                              <span>Submit Idea</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeMode === 'audio' && (
                  <div className="space-y-6">
                    <div className="h-48 bg-gray-900 rounded-xl flex items-center justify-center relative overflow-hidden">
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: 60 }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 bg-gradient-to-t from-green-500 to-emerald-400 rounded-full transition-all duration-300 ${
                              isRecording ? 'animate-pulse' : ''
                            }`}
                            style={{
                              height: `${isRecording ? Math.random() * 120 + 20 : 20}px`,
                              animationDelay: `${i * 30}ms`,
                            }}
                          ></div>
                        ))}
                      </div>
                      
                      {!isRecording && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-gray-500 text-center">
                            <Mic className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>Click record to start capturing audio</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => setIsRecording(!isRecording)}
                        className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg ${
                          isRecording
                            ? 'bg-red-500 hover:bg-red-600 text-white'
                            : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                        }`}
                      >
                        <Mic className="w-8 h-8" />
                      </button>
                    </div>
                  </div>
                )}

                {activeMode === 'visual' && (
                  <div className="space-y-6">
                    <div className="border-2 border-dashed border-purple-300 rounded-xl p-12 text-center">
                      <Camera className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-800 mb-2">Upload Visual Content</h4>
                      <p className="text-gray-600 mb-6">Drag and drop your image, or click to browse</p>
                      <input
                        type="file"
                        onChange={handleFileSelect}
                        accept="image/*,video/*"
                        className="hidden"
                        id="visual-upload"
                      />
                      <label
                        htmlFor="visual-upload"
                        className="cursor-pointer px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium"
                      >
                        Choose File
                      </label>
                    </div>
                    
                    {selectedFile && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Camera className="w-5 h-5 text-gray-500" />
                            <div>
                              <p className="font-medium text-gray-900">{selectedFile.name}</p>
                              <p className="text-sm text-gray-500">
                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={removeFile}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Creativity Analysis Results */}
            {creativityResult && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <span>Creativity Analysis</span>
                </h4>
                
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-1">
                      {creativityResult.score.toFixed(1)}/10
                    </div>
                    <div className="text-sm text-gray-600">Creativity Score</div>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">Key Insights</h5>
                    <ul className="space-y-1">
                      {creativityResult.insights.map((insight: string, index: number) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                          <span className="text-green-500 mt-1">•</span>
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">Suggestions</h5>
                    <ul className="space-y-1">
                      {creativityResult.suggestions.map((suggestion: string, index: number) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {creativityResult.score >= 8 && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                      <h5 className="font-medium text-green-800 mb-2">🎉 High Creativity Detected!</h5>
                      <p className="text-sm text-green-700 mb-3">
                        Your content scored exceptionally high. You can now:
                      </p>
                      <div className="space-y-2">
                        <button className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm font-medium">
                          Apply for NFT Minting
                        </button>
                        <button className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-medium">
                          Publish for Revenue
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Creation Tips */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-4">Creation Tips</h4>
              
              {activeMode === 'idea' && (
                <div className="space-y-3">
                  <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                    <h5 className="font-medium text-yellow-800 mb-1">💡 Innovation</h5>
                    <p className="text-sm text-yellow-700">Think about problems that need solving</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                    <h5 className="font-medium text-green-800 mb-1">🏛️ Policy Ideas</h5>
                    <p className="text-sm text-green-700">Consider social impact and implementation</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                    <h5 className="font-medium text-purple-800 mb-1">🚀 Business</h5>
                    <p className="text-sm text-purple-700">Focus on market needs and scalability</p>
                  </div>
                </div>
              )}

              {activeMode === 'text' && (
                <div className="space-y-3">
                  <div className="bg-pink-50 rounded-lg p-3 border border-pink-200">
                    <h5 className="font-medium text-pink-800 mb-1">😄 Humor</h5>
                    <p className="text-sm text-pink-700">Timing and surprise are key elements</p>
                  </div>
                  <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
                    <h5 className="font-medium text-indigo-800 mb-1">📖 Stories</h5>
                    <p className="text-sm text-indigo-700">Create compelling characters and conflict</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                    <h5 className="font-medium text-orange-800 mb-1">🔤 Wordplay</h5>
                    <p className="text-sm text-orange-700">Experiment with sounds and meanings</p>
                  </div>
                </div>
              )}

              {activeMode === 'audio' && (
                <div className="space-y-3">
                  <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                    <h5 className="font-medium text-green-800 mb-1">🎵 Music</h5>
                    <p className="text-sm text-green-700">Focus on melody, rhythm, and harmony</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <h5 className="font-medium text-blue-800 mb-1">🎙️ Podcasts</h5>
                    <p className="text-sm text-blue-700">Clear audio and engaging content</p>
                  </div>
                </div>
              )}

              {activeMode === 'visual' && (
                <div className="space-y-3">
                  <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                    <h5 className="font-medium text-purple-800 mb-1">🎨 Composition</h5>
                    <p className="text-sm text-purple-700">Consider balance, contrast, and focal points</p>
                  </div>
                  <div className="bg-pink-50 rounded-lg p-3 border border-pink-200">
                    <h5 className="font-medium text-pink-800 mb-1">🌈 Color</h5>
                    <p className="text-sm text-pink-700">Use color to convey emotion and mood</p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-4">Quick Actions</h4>
              <div className="space-y-2">
                <button className="w-full flex items-center space-x-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors text-sm font-medium">
                  <Save className="w-4 h-4" />
                  <span>Save Draft</span>
                </button>
                <button className="w-full flex items-center space-x-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors text-sm font-medium">
                  <Share2 className="w-4 h-4" />
                  <span>Share to Chat</span>
                </button>
                <button className="w-full flex items-center space-x-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors text-sm font-medium">
                  <Upload className="w-4 h-4" />
                  <span>Publish</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudioPage;