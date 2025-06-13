'use client'

import React, { useState } from 'react';
import { Video, Download, DollarSign, Clock, AlertCircle, Play } from 'lucide-react';

const VideoGenerator = () => {
  const [settings, setSettings] = useState({
    youtubeUrl: '',
    category: 'drama',
    duration: 300, // 5 minutes default
    voiceId: 'Adam',
    startTime: 0, // Start time in seconds for YouTube video trimming
    useProduction: false // Toggle between sandbox and production APIs
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState('');
  const [generatedVideo, setGeneratedVideo] = useState(null);
  const [error, setError] = useState('');

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
    if (!settings.youtubeUrl.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }

    setIsGenerating(true);
    setError('');
    setGeneratedVideo(null);
    
    try {
      // Step 1: 🔒 SECURE - Get Reddit story via server-side function
      setProgress('🔍 Finding viral Reddit story...');
      
      const storiesResponse = await fetch('/api/reddit-stories-simple', {
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

      // Step 2: 🔒 SECURE - Generate video via server-side function
      setProgress('🎬 Generating video (server processing)...');
      
      const videoResponse = await fetch('/api/generate-video-simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          enhancedScript: storiesResult.enhancedScript,
          backgroundVideoUrl: settings.youtubeUrl,
          voiceSettings: {
            voice_id: settings.voiceId,
            stability: 0.75,
            similarity_boost: 0.85
          },
          duration: settings.duration,
          startTime: settings.startTime,
          useProduction: settings.useProduction,
          addCaptions: true
        })
      });

      if (!videoResponse.ok) {
        throw new Error(`Video API error: ${videoResponse.status}`);
      }

      const videoResult = await videoResponse.json();
      
      if (!videoResult.success) {
        throw new Error(videoResult.error || 'Video generation failed');
      }

      // Step 3: ✅ SECURE - Server processed everything safely
      setProgress('✅ Video generation complete!');
      setGeneratedVideo({
        videoUrl: videoResult.videoUrl,
        audioUrl: videoResult.audioUrl,
        story: storiesResult.story,
        costs: videoResult.costs,
        mode: videoResult.mode
      });

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
            {/* YouTube URL */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Background YouTube URL
              </label>
              <input
                type="url"
                value={settings.youtubeUrl}
                onChange={(e) => setSettings(prev => ({ ...prev, youtubeUrl: e.target.value }))}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                disabled={isGenerating}
              />
              <p className="mt-2 text-xs text-gray-500">
                Paste any YouTube URL. Testing direct YouTube URLs with Shotstack (no external downloads needed).
              </p>
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
                disabled={isGenerating}
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
              <p className="mt-1 text-xs text-gray-500">Skip intro/ads by starting later in the video</p>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Video Duration (minutes)
              </label>
              <select
                value={settings.duration}
                onChange={(e) => setSettings(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                disabled={isGenerating}
              >
                <option value={60}>1 minute ($0.40)</option>
                <option value={180}>3 minutes ($1.20)</option>
                <option value={300}>5 minutes ($2.00)</option>
                <option value={420}>7 minutes ($2.80)</option>
                <option value={600}>10 minutes ($4.00)</option>
                <option value={900}>15 minutes ($6.00)</option>
              </select>
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
              disabled={isGenerating || !settings.youtubeUrl.trim()}
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