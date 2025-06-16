'use client'

import React, { useState, useEffect } from 'react';
import { Video, Download, DollarSign, Clock, AlertCircle, Play } from 'lucide-react';

const VideoGenerator = () => {
  const [settings, setSettings] = useState({
    uploadedVideo: null,
    category: 'drama',
    targetDuration: 5, // User-chosen duration in minutes
    voiceId: 'Matthew',
    startTime: 0, // Start time in seconds for video trimming
    useProduction: false // Toggle between sandbox and production APIs
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState('');
  const [generatedVideo, setGeneratedVideo] = useState(null);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Story selection state
  const [availableStories, setAvailableStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [isLoadingStories, setIsLoadingStories] = useState(false);

  const categories = [
    { id: 'drama', name: 'Drama', description: 'Relationship conflicts and life drama' },
    { id: 'horror', name: 'Horror', description: 'Scary and unsettling experiences' },
    { id: 'revenge', name: 'Revenge', description: 'Justice and payback stories' },
    { id: 'wholesome', name: 'Wholesome', description: 'Heartwarming and positive stories' },
    { id: 'mystery', name: 'Mystery', description: 'Unexplained and intriguing events' }
  ];

  const voices = [
    { id: 'Matthew', name: 'Matthew - US English Male' },
    { id: 'Joanna', name: 'Joanna - US English Female' },
    { id: 'Amy', name: 'Amy - British English Female' },
    { id: 'Brian', name: 'Brian - British English Male' },
    { id: 'Ivy', name: 'Ivy - US English Female (Child)' },
    { id: 'Joey', name: 'Joey - US English Male' },
    { id: 'Kendra', name: 'Kendra - US English Female' },
    { id: 'Russell', name: 'Russell - Australian English Male' }
  ];

  // Stories will load when user selects category or clicks refresh

  // Handle video file upload - keep file object, no conversion
  const handleVideoUpload = async (file) => {
    if (!file) return;
    
    setIsUploading(true);
    setError('');
    
    try {
      // Just store the file object - NO base64 conversion!
      console.log(`📁 Video selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(1)}MB)`);
      
      setSettings(prev => ({
        ...prev,
        uploadedVideo: {
          file: file,
          name: file.name,
          size: file.size,
          type: file.type
        }
      }));
      
      setIsUploading(false);
      
    } catch (error) {
      console.error('File selection error:', error);
      setError(`File selection failed: ${error.message}`);
      setIsUploading(false);
    }
  };

  // Calculate if story matches target duration
  const getEstimatedDuration = (story) => {
    if (!story) return 0;
    const wordCount = story.content.split(' ').length;
    const wordsPerMinute = 150 * 1.3; // 195 WPM at 1.3x speed
    return wordCount / wordsPerMinute; // Returns minutes
  };

  // Fetch fresh Reddit stories based on target duration
  const fetchStories = async (category, targetDuration = settings.targetDuration) => {
    setIsLoadingStories(true);
    setError('');
    
    // Clear current selection to force fresh selection
    setSelectedStory(null);
    setAvailableStories([]);
    
    try {
      const response = await fetch(`/api/reddit-stories?nocache=${Date.now()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        body: JSON.stringify({
          category: category,
          targetDuration: targetDuration, // Send user's chosen duration
          limit: 15, // Get more stories to find good matches
          refresh: Date.now(),
          random: Math.random()
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Stories API error: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch stories');
      }

      // Use backend-calculated duration (more accurate and consistent)
      const storiesWithDuration = result.stories ? result.stories.map(story => ({
        ...story,
        estimatedDuration: story.estimated_duration_minutes || getEstimatedDuration(story) // Fallback to old method if backend doesn't provide it
      })) : [{
        ...result.story,
        estimatedDuration: result.story.estimated_duration_minutes || getEstimatedDuration(result.story)
      }];

      setAvailableStories(storiesWithDuration);
      
      // DON'T auto-select story - let user choose manually
      console.log(`✅ Loaded ${storiesWithDuration.length} stories for ${targetDuration}-minute target:`, 
        storiesWithDuration.map(s => `${s.title} (${s.estimatedDuration.toFixed(1)} min)`));
      
    } catch (error) {
      console.error('Failed to fetch stories:', error);
      setError(`Failed to load stories: ${error.message}`);
    } finally {
      setIsLoadingStories(false);
    }
  };

  // Calculate estimated costs based on target duration
  const estimatedCost = () => {
    if (!selectedStory) return 0;
    const durationMinutes = settings.targetDuration;
    const shotstackCost = durationMinutes * 0.40;
    const claudeCost = Math.min(0.50, durationMinutes * 0.03);
    const elevenlabsCost = (durationMinutes * 250) / 1000 * 0.018;
    return shotstackCost + claudeCost + elevenlabsCost;
  };

  // 🔒 SECURE SERVER-SIDE API CALL - NO EXPOSED KEYS
  const generateVideo = async () => {
    if (!settings.uploadedVideo) {
      setError('Please upload a video file');
      return;
    }
    
    if (!selectedStory) {
      setError('Please select a Reddit story');
      return;
    }

    setIsGenerating(true);
    setError('');
    setGeneratedVideo(null);
    
    try {
      // Step 1: Prepare uploaded video data for Shotstack
      setProgress('📹 Preparing uploaded video for processing...');
      
      // Step 2: Use selected Reddit story (already fetched)
      setProgress('✅ Using selected Reddit story...');

      // Step 3: 🔒 SECURE - Generate video via server-side function
      setProgress('🎬 Generating video (server processing)...');
      
      // Send file and metadata separately using FormData
      const formData = new FormData();
      formData.append('videoFile', settings.uploadedVideo.file);
      formData.append('data', JSON.stringify({
        selectedStory: selectedStory,
        targetDuration: settings.targetDuration,
        voiceSettings: {
          voice_id: settings.voiceId,
          stability: 0.75,
          similarity_boost: 0.85,
          speed: 1.3 // 1.3x speed for voiceover
        },
        duration: settings.targetDuration * 60, // Convert minutes to seconds
        startTime: settings.startTime,
        trimDuration: settings.targetDuration * 60, // Convert minutes to seconds
        useProduction: settings.useProduction,
        addCaptions: true
      }));

      const videoResponse = await fetch('/api/generate-video-async', {
        method: 'POST',
        body: formData // NO Content-Type header - let browser set it for FormData
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

      // Show processing status
      if (videoResult.render_id) {
        setProgress('🔄 Video processing started! This will take 3-5 minutes...');
        setGeneratedVideo({
          videoUrl: null, // No video yet
          audioUrl: null,
          story: selectedStory,
          costs: { shotstack_cost: 0, elevenlabs_cost: 0, total_cost: 0 },
          mode: 'processing',
          render_id: videoResult.render_id,
          source_id: videoResult.source_id,
          status_url: videoResult.status_check_url,
          message: videoResult.message
        });
      } else {
        // Should not reach here with new workflow
        setError('Unexpected response from video generation API');
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

            {/* Target Duration - USER CONTROL */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Target Video Duration
              </label>
              <select
                value={settings.targetDuration}
                onChange={(e) => {
                  const newDuration = parseInt(e.target.value);
                  setSettings(prev => ({ ...prev, targetDuration: newDuration }));
                  // Refresh stories when duration changes
                  if (settings.category) {
                    fetchStories(settings.category, newDuration);
                  }
                }}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                disabled={isGenerating || isLoadingStories}
              >
                <option value={2}>2 minutes</option>
                <option value={3}>3 minutes</option>
                <option value={5}>5 minutes</option>
                <option value={7}>7 minutes</option>
                <option value={10}>10 minutes</option>
                <option value={12}>12 minutes</option>
                <option value={15}>15 minutes</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Stories will be filtered to match this duration
              </p>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Story Category
              </label>
              <select
                value={settings.category}
                onChange={(e) => {
                  const newCategory = e.target.value;
                  setSettings(prev => ({ ...prev, category: newCategory }));
                  fetchStories(newCategory, settings.targetDuration);
                }}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                disabled={isGenerating || isLoadingStories}
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <button
                onClick={() => fetchStories(settings.category, settings.targetDuration)}
                disabled={isLoadingStories || isGenerating}
                className="mt-2 w-full px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded text-sm transition-colors"
              >
                {isLoadingStories ? 'Loading...' : 'Find Stories for This Duration'}
              </button>
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

            {/* Current Target Display */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Selected Configuration
              </label>
              <div className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-blue-400" />
                  <span className="text-white font-medium">
                    {settings.targetDuration} minute {settings.category} video
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Shotstack will generate voiceover and trim video to exactly {settings.targetDuration} minutes
                </p>
              </div>
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
                    {selectedStory ? 
                      (settings.useProduction ? `$${estimatedCost().toFixed(2)}` : '$0.00 (Sandbox)')
                      : 'Select story to see cost'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Story Browser */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">
            Reddit Stories for {settings.targetDuration}-Minute Video
          </h2>
          
          {availableStories.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">
                Choose duration and category above to find matching Reddit stories
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {availableStories.map((story, index) => {
                const matchQuality = Math.abs(story.estimatedDuration - settings.targetDuration);
                const isGoodMatch = matchQuality <= 1; // Within 1 minute
                
                return (
                  <div
                    key={story.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${ 
                      selectedStory?.id === story.id 
                        ? 'border-blue-500 bg-blue-900/20' 
                        : isGoodMatch
                        ? 'border-green-500/50 bg-gray-700/50 hover:bg-gray-700'
                        : 'border-gray-600 bg-gray-700/50 hover:bg-gray-700'
                    }`}
                    onClick={() => {
                      setSelectedStory(story);
                    }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-white font-medium">{story.title}</h3>
                      <div className="flex gap-2 text-xs">
                        <span className="px-2 py-1 bg-gray-600 rounded text-white">
                          r/{story.subreddit}
                        </span>
                        <span className={`px-2 py-1 rounded text-white ${
                          isGoodMatch ? 'bg-green-600' : 'bg-yellow-600'
                        }`}>
                          {story.estimatedDuration.toFixed(1)} min
                        </span>
                        {isGoodMatch && (
                          <span className="px-2 py-1 bg-green-500 rounded text-white">
                            Perfect Match
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-gray-300 text-sm line-clamp-3 mb-3">
                      {story.content.substring(0, 200)}...
                    </p>
                    
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <div className="flex gap-4">
                        <span>👍 {story.upvotes}</span>
                        <span>💬 {story.comments}</span>
                        <span>🔥 {Math.round(story.viral_score)}</span>
                      </div>
                      <span className="font-medium">
                        {Math.round(story.content.split(' ').length)} words
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {selectedStory && (
            <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500 rounded-lg">
              <h3 className="text-blue-300 font-medium mb-2">Selected Story for {settings.targetDuration}-Minute Video</h3>
              <p className="text-white font-medium">{selectedStory.title}</p>
              <p className="text-gray-300 text-sm mt-1">
                Estimated: {selectedStory.estimatedDuration.toFixed(1)} minutes 
                ({Math.round(selectedStory.content.split(' ').length)} words)
              </p>
              <p className="text-green-400 text-xs mt-1">
                ✅ Shotstack will generate exact {settings.targetDuration}-minute voiceover at 1.3x speed
              </p>
            </div>
          )}
        </div>

        {/* Generate Video Button */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
          <div className="mt-4">
            <button
              onClick={generateVideo}
              disabled={isGenerating || !settings.uploadedVideo || !selectedStory}
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
            
            {!selectedStory && (
              <p className="text-center text-gray-400 text-sm mt-2">
                Select a story above to generate video
              </p>
            )}
            
            {selectedStory && !settings.uploadedVideo && (
              <p className="text-center text-red-400 text-sm mt-2">
                Upload a background video to continue
              </p>
            )}
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
                      <span className="text-white">{settings.targetDuration} minutes</span>
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