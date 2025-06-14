'use client'

import React, { useState } from 'react';
import { Video, Download, DollarSign, Clock, AlertCircle, Play } from 'lucide-react';

const VideoGenerator = () => {
  const [settings, setSettings] = useState({
    uploadedVideo: null,
    category: 'drama',
    duration: 300, // 5 minutes default
    voiceId: 'Adam',
    startTime: 0, // Start time in seconds for video trimming
    trimDuration: 300, // Duration to use from video (5 minutes default)
    useProduction: false // Toggle between sandbox and production APIs
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState('');
  const [generatedVideo, setGeneratedVideo] = useState(null);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const categories = [
    { id: 'drama', name: 'Drama', description: 'Relationship conflicts and life drama' },
    { id: 'horror', name: 'Horror', description: 'Scary and unsettling experiences' },
    { id: 'revenge', name: 'Revenge', description: 'Justice and payback stories' },
    { id: 'wholesome', name: 'Wholesome', description: 'Heartwarming and positive stories' },
    { id: 'mystery', name: 'Mystery', description: 'Unexplained and intriguing events' }
  ];

  const voices = [
    { id: 'Adam', name: 'Adam - Professional Male' },
    { id: 'Bella', name: 'Bella - Warm Female' },
    { id: 'Charlie', name: 'Charlie - Conversational Male' },
    { id: 'Dorothy', name: 'Dorothy - Mature Female' }
  ];

  // Handle video file upload - client-side for direct Shotstack integration
  const handleVideoUpload = async (file) => {
    if (!file) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    setError('');
    
    try {
      // Convert file to base64 for Shotstack API
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Data = event.target.result;
        
        setSettings(prev => ({
          ...prev,
          uploadedVideo: {
            file: file,
            base64: base64Data,
            name: file.name,
            size: file.size,
            type: file.type
          }
        }));
        
        setUploadProgress(100);
      };
      
      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          setUploadProgress(progress);
        }
      };
      
      reader.readAsDataURL(file);
      
    } catch (error) {
      console.error('File processing error:', error);
      setError(`File processing failed: ${error.message}`);
      setIsUploading(false);
    }
  };

  // Calculate estimated costs
  const estimatedCost = () => {
    const durationMinutes = settings.duration / 60;
    const shotstackCost = durationMinutes * 0.40;
    const claudeCost = Math.min(0.50, durationMinutes * 0.03); // Estimate based on duration
    const elevenlabsCost = (durationMinutes * 250) / 1000 * 0.018; // ~250 chars per minute estimate
    return shotstackCost + claudeCost + elevenlabsCost;
  };

  // 🔒 SECURE SERVER-SIDE API CALL - NO EXPOSED KEYS
  const generateVideo = async () => {
    if (!settings.uploadedVideo) {
      setError('Please upload a video file');
      return;
    }

    setIsGenerating(true);
    setError('');
    setGeneratedVideo(null);
    
    try {
      // Step 1: Prepare uploaded video data for Shotstack
      setProgress('📹 Preparing uploaded video for processing...');
      
      // Step 2: 🔒 SECURE - Get Reddit story via server-side function
      setProgress('🔍 Finding viral Reddit story...');
      
      const storiesResponse = await fetch('/api/reddit-stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: settings.category,
          duration: settings.duration
        })
      });

      if (!storiesResponse.ok) {
        throw new Error(`Stories API error: ${storiesResponse.status}`);
      }

      const storiesResult = await storiesResponse.json();
      
      if (!storiesResult.success) {
        throw new Error(storiesResult.error || 'No suitable stories found');
      }

      // Step 3: 🔒 SECURE - Generate video via server-side function
      setProgress('🎬 Generating video (server processing)...');
      
      const videoResponse = await fetch('/api/generate-video-async', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          enhancedScript: storiesResult.enhancedScript,
          uploadedVideo: {
            base64: settings.uploadedVideo.base64,
            filename: settings.uploadedVideo.name,
            type: settings.uploadedVideo.type
          },
          voiceSettings: {
            voice_id: settings.voiceId,
            stability: 0.75,
            similarity_boost: 0.85
          },
          duration: settings.duration,
          startTime: settings.startTime,
          trimDuration: settings.trimDuration,
          useProduction: settings.useProduction,
          addCaptions: true
        })
      });

      if (!videoResponse.ok) {
        const errorData = await videoResponse.text();
        console.error('Video API error response:', errorData);
        throw new Error(`Video API error: ${videoResponse.status} - ${errorData}`);
      }

      const videoResult = await videoResponse.json();
      
      if (!videoResult.success) {
        throw new Error(videoResult.error || 'Video generation failed');
      }

      // For async processing, show different UI
      if (videoResult.ingest_id) {
        setProgress('🔄 Video processing started! This will take 5-10 minutes...');
        setGeneratedVideo({
          videoUrl: null, // No video yet
          audioUrl: null,
          story: storiesResult.story,
          costs: { shotstack_cost: 0, elevenlabs_cost: 0, total_cost: 0 },
          mode: 'processing',
          ingest_id: videoResult.ingest_id,
          status_url: videoResult.status_check_url,
          message: videoResult.message
        });
      } else {
        // Step 3: ✅ SECURE - Server processed everything safely
        setProgress('✅ Video generation complete!');
        setGeneratedVideo({
          videoUrl: videoResult.videoUrl,
          audioUrl: videoResult.audioUrl,
          story: storiesResult.story,
          costs: videoResult.costs,
          mode: videoResult.mode
        });
      }

    } catch (error) {
      console.error('Video generation failed:', error);
      setError(error.message || 'Video generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadVideo = () => {
    if (generatedVideo?.videoUrl) {
      const link = document.createElement('a');
      link.href = generatedVideo.videoUrl;
      link.download = `reddit-video-${Date.now()}.mp4`;
      link.click();
    }
  };

  // Helper function to extract YouTube video ID
  const extractVideoId = (url) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-950">
        <div className="container mx-auto px-6 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Reddit Story Video Generator</h1>
            <p className="text-gray-400">Transform viral Reddit stories into YouTube videos</p>
            <p className="text-xs text-gray-500 mt-2">
              🔒 SECURE ARCHITECTURE v6 - API keys safely stored server-side only
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Settings Panel */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">Video Settings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Video Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Background Video Upload
              </label>
              
              {!settings.uploadedVideo ? (
                <div 
                  className="w-full p-8 border-2 border-dashed border-gray-600 rounded-lg bg-gray-700/50 hover:bg-gray-700/70 transition-colors cursor-pointer"
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files[0];
                    if (file && file.type.startsWith('video/')) {
                      handleVideoUpload(file);
                    }
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => document.getElementById('video-upload').click()}
                >
                  <div className="text-center">
                    <Video size={48} className="mx-auto mb-4 text-gray-400" />
                    <p className="text-white font-medium mb-2">Drop video file here or click to browse</p>
                    <p className="text-sm text-gray-400 mb-4">Supports: MP4, MOV, AVI, WebM (Max 100MB)</p>
                    {isUploading && (
                      <div className="mt-4">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                          <span className="text-sm text-blue-400">Uploading... {uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-600 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Video size={24} className="text-green-400" />
                      <div>
                        <p className="text-white font-medium">{settings.uploadedVideo.name}</p>
                        <p className="text-sm text-gray-400">
                          {(settings.uploadedVideo.size / (1024 * 1024)).toFixed(1)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSettings(prev => ({ ...prev, uploadedVideo: null }))}
                      className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 rounded text-white transition-colors"
                      disabled={isGenerating}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
              
              <input
                id="video-upload"
                type="file"
                accept="video/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) handleVideoUpload(file);
                }}
                className="hidden"
                disabled={isGenerating || isUploading}
              />
              
              <div className="mt-2 space-y-1">
                <p className="text-xs text-green-400">
                  ✅ Direct video upload - no third-party dependencies
                </p>
                <p className="text-xs text-gray-400">
                  Workflow: Upload Video → Set Time Range → Generate Content → Final Video
                </p>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Story Category
              </label>
              <select
                value={settings.category}
                onChange={(e) => setSettings(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                disabled={isGenerating}
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Voice */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Voice Selection
              </label>
              <select
                value={settings.voiceId}
                onChange={(e) => setSettings(prev => ({ ...prev, voiceId: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                disabled={isGenerating}
              >
                {voices.map(voice => (
                  <option key={voice.id} value={voice.id}>{voice.name}</option>
                ))}
              </select>
            </div>

            {/* Start Time */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Start Time (minutes into video)
              </label>
              <select
                value={settings.startTime}
                onChange={(e) => setSettings(prev => ({ ...prev, startTime: parseInt(e.target.value) }))}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                disabled={isGenerating || !settings.uploadedVideo}
              >
                <option value={0}>Start from beginning</option>
                <option value={60}>1 minute in</option>
                <option value={120}>2 minutes in</option>
                <option value={300}>5 minutes in</option>
                <option value={600}>10 minutes in</option>
                <option value={900}>15 minutes in</option>
                <option value={1200}>20 minutes in</option>
                <option value={1800}>30 minutes in</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">Choose where to start using your uploaded video</p>
            </div>

            {/* Trim Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Use Duration (how much video to use)
              </label>
              <select
                value={settings.trimDuration}
                onChange={(e) => setSettings(prev => ({ ...prev, trimDuration: parseInt(e.target.value), duration: parseInt(e.target.value) }))}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                disabled={isGenerating || !settings.uploadedVideo}
              >
                <option value={60}>1 minute ($0.40)</option>
                <option value={180}>3 minutes ($1.20)</option>
                <option value={300}>5 minutes ($2.00)</option>
                <option value={420}>7 minutes ($2.80)</option>
                <option value={600}>10 minutes ($4.00)</option>
                <option value={900}>15 minutes ($6.00)</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">Amount of video to use starting from your chosen start time</p>
            </div>

            {/* API Mode Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                API Mode
              </label>
              <div className="flex items-center gap-4 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="apiMode"
                    checked={!settings.useProduction}
                    onChange={() => setSettings(prev => ({ ...prev, useProduction: false }))}
                    className="text-blue-500"
                    disabled={isGenerating}
                  />
                  <span className="text-white">Sandbox (Testing)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="apiMode"
                    checked={settings.useProduction}
                    onChange={() => setSettings(prev => ({ ...prev, useProduction: true }))}
                    className="text-blue-500"
                    disabled={isGenerating}
                  />
                  <span className="text-white">Production (Real $)</span>
                </label>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {settings.useProduction ? 'Uses real API credits - costs real money' : 'Free testing mode with watermarks'}
              </p>
            </div>

            {/* Cost Estimate */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Estimated Cost
              </label>
              <div className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg">
                <div className="flex items-center gap-2">
                  <DollarSign size={16} className="text-green-400" />
                  <span className="text-white font-medium">
                    {settings.useProduction ? `$${estimatedCost().toFixed(2)}` : '$0.00 (Sandbox)'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="mt-8">
            <button
              onClick={generateVideo}
              disabled={isGenerating || !settings.uploadedVideo}
              className="w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Generating Video...
                </>
              ) : (
                <>
                  <Video size={20} />
                  Generate Video
                </>
              )}
            </button>
          </div>
        </div>

        {/* Progress */}
        {isGenerating && (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <span className="text-white font-medium">{progress}</span>
            </div>
            <div className="mt-4 text-sm text-gray-400">
              ⏱️ This process takes 2-5 minutes. APIs are called only during generation.
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mb-8">
            <div className="flex items-center gap-2">
              <AlertCircle size={20} className="text-red-400" />
              <span className="text-red-300 font-medium">Error</span>
            </div>
            <p className="text-red-200 mt-2">{error}</p>
          </div>
        )}

        {/* Generated Video */}
        {generatedVideo && (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-6">Generated Video</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Video Preview */}
              <div>
                <div className="bg-gray-900 rounded-lg p-4 aspect-[9/16] flex items-center justify-center">
                  <div className="text-center">
                    <Video size={48} className="mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-400 mb-4">Video Ready</p>
                    <button
                      onClick={downloadVideo}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
                    >
                      <Download size={16} />
                      Download MP4
                    </button>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-white mb-2">Story Details</h3>
                  <p className="text-sm text-gray-400">From r/{generatedVideo.story.subreddit}</p>
                  <p className="text-white font-medium">{generatedVideo.story.title}</p>
                </div>

                <div>
                  <h3 className="font-medium text-white mb-2">Generation Costs</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Shotstack:</span>
                      <span className="text-white">${generatedVideo.costs?.shotstack_cost?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">ElevenLabs:</span>
                      <span className="text-white">${generatedVideo.costs?.elevenlabs_cost?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-600 pt-1">
                      <span className="text-white font-medium">Total:</span>
                      <span className="text-white font-medium">${generatedVideo.costs?.total_cost?.toFixed(2) || '0.00'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-white mb-2">Video Info</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Duration:</span>
                      <span className="text-white">{Math.floor(settings.duration / 60)}:{(settings.duration % 60).toString().padStart(2, '0')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Voice:</span>
                      <span className="text-white">{settings.voiceId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Category:</span>
                      <span className="text-white capitalize">{settings.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Mode:</span>
                      <span className="text-white capitalize">{generatedVideo.mode || 'sandbox'}</span>
                    </div>
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

export default VideoGenerator;