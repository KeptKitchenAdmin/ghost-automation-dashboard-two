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
      // Step 1: Convert YouTube URL to direct MP4 if needed
      let processedVideoUrl = settings.youtubeUrl;
      
      if (settings.youtubeUrl.includes('youtube.com') || settings.youtubeUrl.includes('youtu.be')) {
        setProgress('🔄 Converting YouTube URL to direct MP4...');
        
        try {
          // Try multiple YouTube extraction methods
          setProgress('🔄 Trying YouTube extraction methods...');
          
          // Method 1: Try Cobalt first
          try {
            const cobaltResponse = await fetch('https://cobalt-latest-qymt.onrender.com/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify({
                url: settings.youtubeUrl,
                videoQuality: "720",
                audioFormat: "mp3",
                youtubeVideoCodec: "h264"
              })
            });
            
            const cobaltData = await cobaltResponse.json();
            
            if (cobaltData.url) {
              processedVideoUrl = cobaltData.url;
              setProgress('✅ YouTube URL converted via Cobalt!');
            } else {
              throw new Error('Cobalt failed: ' + (cobaltData.error?.code || 'Unknown'));
            }
          } catch (cobaltError) {
            console.warn('Cobalt failed:', cobaltError.message);
            
            // Method 2: Try alternative YouTube API
            try {
              setProgress('🔄 Trying alternative YouTube downloader...');
              
              const ytResponse = await fetch(`https://youtube-mp36.p.rapidapi.com/dl?id=${extractVideoId(settings.youtubeUrl)}`, {
                method: 'GET',
                headers: {
                  'X-RapidAPI-Key': 'demo-key', // Free tier
                  'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com'
                }
              });
              
              const ytData = await ytResponse.json();
              
              if (ytData.link) {
                processedVideoUrl = ytData.link;
                setProgress('✅ YouTube URL converted via alternative API!');
              } else {
                throw new Error('Alternative API failed');
              }
            } catch (altError) {
              console.warn('Alternative API failed:', altError.message);
              
              // Method 3: Use a working public API
              try {
                setProgress('🔄 Trying public YouTube converter...');
                
                const publicResponse = await fetch('https://yt-api.p.rapidapi.com/dl', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'X-RapidAPI-Key': 'demo-key'
                  },
                  body: JSON.stringify({ url: settings.youtubeUrl })
                });
                
                const publicData = await publicResponse.json();
                
                if (publicData.formats && publicData.formats.length > 0) {
                  // Find MP4 format
                  const mp4Format = publicData.formats.find(f => f.ext === 'mp4');
                  if (mp4Format) {
                    processedVideoUrl = mp4Format.url;
                    setProgress('✅ YouTube URL converted via public API!');
                  } else {
                    throw new Error('No MP4 format found');
                  }
                } else {
                  throw new Error('Public API failed');
                }
              } catch (publicError) {
                console.warn('All YouTube converters failed');
                setError('Unable to convert YouTube URL. YouTube is blocking all conversion methods. Please use a direct MP4 URL instead.');
                return;
              }
            }
          }
        } catch (extractionError) {
          console.error('YouTube extraction failed:', extractionError);
          setError('YouTube conversion failed. Please try a direct MP4 URL instead.');
          return;
        }
      }
      
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
          backgroundVideoUrl: processedVideoUrl, // Use the converted URL
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
            {/* YouTube URL */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Background Video URL
              </label>
              <input
                type="url"
                value={settings.youtubeUrl}
                onChange={(e) => setSettings(prev => ({ ...prev, youtubeUrl: e.target.value }))}
                placeholder="https://youtube.com/watch?v=... or https://example.com/video.mp4"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                disabled={isGenerating}
              />
              <div className="mt-2 space-y-1">
                <p className="text-xs text-green-400">
                  ✅ YouTube URLs supported via personal Cobalt instance
                </p>
                <p className="text-xs text-gray-500">
                  Examples: 
                  <button 
                    onClick={() => setSettings(prev => ({ ...prev, youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }))}
                    className="ml-1 text-blue-400 hover:text-blue-300 underline"
                    disabled={isGenerating}
                  >
                    YouTube
                  </button>
                  {' | '}
                  <button 
                    onClick={() => setSettings(prev => ({ ...prev, youtubeUrl: 'https://shotstack-assets.s3-ap-southeast-2.amazonaws.com/footage/beach-overhead.mp4' }))}
                    className="ml-1 text-blue-400 hover:text-blue-300 underline"
                    disabled={isGenerating}
                  >
                    Direct MP4
                  </button>
                </p>
                <p className="text-xs text-gray-400">
                  Workflow: YouTube → Cobalt (your instance) → Direct MP4 → Shotstack → Final Video
                </p>
                <p className="text-xs text-yellow-400">
                  🔧 Cobalt instance: cobalt-latest-qymt.onrender.com
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