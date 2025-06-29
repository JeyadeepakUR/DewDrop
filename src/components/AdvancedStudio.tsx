import React, { useState, useRef, useEffect } from 'react';
import { Mic, Video, Square, Play, Pause, Upload, Zap, Settings, Save, Share2 } from 'lucide-react';
import { RecordingService } from '../services/recording';
import { contentService, aiService } from '../services/supabase';
import { web3Service } from '../services/web3';

const AdvancedStudio: React.FC = () => {
  const [recordingService] = useState(new RecordingService());
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiEnhancing, setAiEnhancing] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout>();
  const audioLevelRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const initializeRecording = async () => {
      await recordingService.initialize({
        audio: {
          sampleRate: 48000,
          channelCount: 2,
          bitDepth: 24
        }
      });
    };

    initializeRecording();
    setWalletConnected(web3Service.isConnected());

    return () => {
      recordingService.cleanup();
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (audioLevelRef.current) clearInterval(audioLevelRef.current);
    };
  }, []);

  const startRecording = async () => {
    const result = recordingService.startRecording();
    if (result.success) {
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      // Start audio level monitoring
      audioLevelRef.current = setInterval(() => {
        const level = recordingService.getAudioLevel();
        setAudioLevel(level);
      }, 100);
    }
  };

  const stopRecording = async () => {
    const result = await recordingService.stopRecording();
    if (result.success && result.blob) {
      setRecordedBlob(result.blob);
      setIsRecording(false);
      setIsPaused(false);
      
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (audioLevelRef.current) clearInterval(audioLevelRef.current);
    }
  };

  const togglePause = () => {
    if (isPaused) {
      recordingService.resumeRecording();
    } else {
      recordingService.pauseRecording();
    }
    setIsPaused(!isPaused);
  };

  const enhanceWithAI = async () => {
    if (!recordedBlob) return;

    setAiEnhancing(true);
    try {
      // Convert blob to URL for AI processing
      const audioUrl = URL.createObjectURL(recordedBlob);
      await aiService.enhanceAudio(audioUrl);
      // In real implementation, this would return enhanced audio
    } catch (error) {
      console.error('AI enhancement failed:', error);
    } finally {
      setAiEnhancing(false);
    }
  };

  const uploadAndMint = async () => {
    if (!recordedBlob) return;

    setIsProcessing(true);
    try {
      // Upload to storage
      const file = new File([recordedBlob], 'recording.webm', { type: 'audio/webm' });
      const { data: uploadData, error: uploadError } = await contentService.uploadFile(file);
      
      if (uploadError) throw uploadError;

      // Generate AI tags and description
      const tags = await aiService.generateTags('Audio recording');
      const description = await aiService.generateDescription('My Recording', tags as string[]);

      // Create content record
      const creation = {
        title: 'My Recording',
        description: description as string,
        creator_id: 'current-user-id',
        file_url: uploadData!.url,
        duration: recordingTime,
        type: 'audio' as const,
        tags: tags as string[],
        is_nft: walletConnected,
        price: 0,
        currency: 'ETH' as const,
        likes_count: 0,
        comments_count: 0,
        shares_count: 0,
        plays_count: 0,
        ai_generated_tags: tags as string[],
        ai_enhancement_applied: aiEnhancing,
        creator: {
          id: 'current-user-id',
          username: 'Current User',
          email: 'user@example.com',
          is_verified: false,
          created_at: new Date().toISOString(),
          total_earnings: 0,
          follower_count: 0,
          following_count: 0
        }
      };

      const { error: createError } = await contentService.createContent(creation);
      if (createError) throw createError;

      // Mint as NFT if wallet connected
      if (walletConnected) {
        await web3Service.mintNFT({
          title: creation.title,
          description: creation.description,
          file_url: creation.file_url,
          creator: creation.creator.username
        });
      }

      // Reset state
      setRecordedBlob(null);
      setRecordingTime(0);
      
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const connectWallet = async () => {
    const result = await web3Service.connectWallet();
    if (result.success) {
      setWalletConnected(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Advanced Recording Studio</h1>
          <p className="text-gray-600">Professional-grade recording with AI enhancement and Web3 integration</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Recording Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              {/* Studio Header */}
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <h3 className="text-lg font-semibold">Dewdrop Studio Pro</h3>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-300">
                      {isRecording ? (
                        <span className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          <span>REC {formatTime(recordingTime)}</span>
                        </span>
                      ) : recordedBlob ? (
                        'Recording Complete'
                      ) : (
                        'Ready to Record'
                      )}
                    </div>
                    <Settings className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                  </div>
                </div>
              </div>

              {/* Waveform Visualization */}
              <div className="bg-gray-900 p-8">
                <div className="h-40 bg-gray-800 rounded-lg flex items-center justify-center relative overflow-hidden">
                  <div className="flex items-end space-x-1">
                    {Array.from({ length: 60 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 bg-gradient-to-t from-blue-500 to-teal-400 rounded-full transition-all duration-300 ${
                          isRecording && !isPaused ? 'animate-pulse' : ''
                        }`}
                        style={{
                          height: `${isRecording ? Math.random() * 80 + 20 : 20}px`,
                          animationDelay: `${i * 30}ms`,
                          opacity: isRecording ? Math.max(0.3, audioLevel) : 0.3
                        }}
                      ></div>
                    ))}
                  </div>
                  
                  {/* Audio Level Indicator */}
                  {isRecording && (
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center space-x-2 bg-black/50 rounded-lg px-3 py-2">
                        <Mic className="w-4 h-4 text-white" />
                        <div className="w-20 h-2 bg-gray-600 rounded-full">
                          <div
                            className="h-2 bg-green-500 rounded-full transition-all duration-100"
                            style={{ width: `${audioLevel * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Controls */}
              <div className="p-8 bg-white">
                <div className="flex items-center justify-center space-x-6 mb-8">
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={isProcessing}
                    className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg ${
                      isRecording
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isRecording ? <Square className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                  </button>

                  {isRecording && (
                    <button
                      onClick={togglePause}
                      className="w-16 h-16 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg"
                    >
                      {isPaused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
                    </button>
                  )}
                </div>

                {recordedBlob && (
                  <div className="flex items-center justify-center space-x-4">
                    <button
                      onClick={enhanceWithAI}
                      disabled={aiEnhancing}
                      className="flex items-center space-x-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Zap className="w-5 h-5" />
                      <span>{aiEnhancing ? 'Enhancing...' : 'AI Enhance'}</span>
                    </button>

                    <button
                      onClick={uploadAndMint}
                      disabled={isProcessing}
                      className="flex items-center space-x-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Upload className="w-5 h-5" />
                      <span>{isProcessing ? 'Processing...' : 'Upload & Mint'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Controls */}
          <div className="space-y-6">
            {/* Recording Settings */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-4">Recording Settings</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quality</label>
                  <select className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <option>Professional (48kHz/24-bit)</option>
                    <option>High (44.1kHz/16-bit)</option>
                    <option>Standard (22kHz/16-bit)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
                  <select className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <option>WebM (Opus)</option>
                    <option>MP4 (AAC)</option>
                    <option>WAV (Uncompressed)</option>
                  </select>
                </div>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                  <span className="text-gray-700">Noise Suppression</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                  <span className="text-gray-700">Echo Cancellation</span>
                </label>
              </div>
            </div>

            {/* Web3 Integration */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-4">Web3 Integration</h4>
              {walletConnected ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Wallet Connected</span>
                  </div>
                  <div className="text-xs text-gray-500 font-mono">
                    {web3Service.getAccount()?.slice(0, 6)}...{web3Service.getAccount()?.slice(-4)}
                  </div>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                    <span className="text-gray-700">Auto-mint as NFT</span>
                  </label>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price (ETH)</label>
                    <input
                      type="number"
                      step="0.001"
                      placeholder="0.1"
                      className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  Connect Wallet
                </button>
              )}
            </div>

            {/* AI Features */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-4">AI Features</h4>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                  <span className="text-gray-700">Auto-generate tags</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                  <span className="text-gray-700">Create description</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span className="text-gray-700">Audio enhancement</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span className="text-gray-700">Generate thumbnail</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedStudio;