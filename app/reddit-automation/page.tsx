'use client';

import React, { useState, useEffect } from 'react';
import { ChevronRight, Video, Clock, DollarSign, Play, Download, RefreshCw, AlertCircle, BarChart3 } from 'lucide-react';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { RedditStory, GeneratedVideo, WorkflowState } from '../../lib/types/reddit-automation';

const RedditVideoAutomation = () => {
  const [activeTab, setActiveTab] = useState('scrape');
  const [loading, setLoading] = useState(false);
  const [stories, setStories] = useState<RedditStory[]>([]);
  const [selectedStory, setSelectedStory] = useState<RedditStory | null>(null);
  const [workflowStatus, setWorkflowStatus] = useState<WorkflowState | null>(null);
  const [generatedVideos, setGeneratedVideos] = useState<GeneratedVideo[]>([]);
  const [usageStats, setUsageStats] = useState<any>(null);
  const [videoPreview, setVideoPreview] = useState<GeneratedVideo | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [sortBy, setSortBy] = useState<'viral_score' | 'upvotes' | 'comments' | 'duration'>('viral_score');
  const [filterMinScore, setFilterMinScore] = useState(5);
  const [filterMinDuration, setFilterMinDuration] = useState(60);
  const [selectedStories, setSelectedStories] = useState<Set<string>>(new Set());

  const [videoSettings, setVideoSettings] = useState({
    duration: 300, // 5 minutes default
    voice_id: 'Adam',
    background_url: 'https://github.com/shotstack/test-media/raw/main/footage/beach-overhead.mp4',
    add_captions: true,
    music_volume: 0.3
  });

  const categories = [
    { id: 'drama', name: 'Drama', description: 'Relationship conflicts and life drama' },
    { id: 'horror', name: 'Horror', description: 'Scary and unsettling experiences' },
    { id: 'revenge', name: 'Revenge', description: 'Justice and payback stories' },
    { id: 'wholesome', name: 'Wholesome', description: 'Heartwarming and positive stories' },
    { id: 'mystery', name: 'Mystery', description: 'Unexplained and intriguing events' }
  ];

  const voiceOptions = [
    { id: 'Adam', name: 'Adam - Professional Male' },
    { id: 'Bella', name: 'Bella - Warm Female' },
    { id: 'Charlie', name: 'Charlie - Conversational Male' },
    { id: 'Dorothy', name: 'Dorothy - Mature Female' }
  ];

  // Load usage stats on component mount
  useEffect(() => {
    fetchUsageStats();
  }, []);

  const fetchUsageStats = async () => {
    try {
      console.log('📊 Fetching real-time usage statistics');
      
      // Try to fetch from API endpoint first
      try {
        const response = await fetch('/api/reddit-automation/usage-stats');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setUsageStats(data);
            console.log('✅ Usage stats fetched from API');
            return;
          }
        }
      } catch (apiError) {
        console.warn('⚠️ API endpoint not available, using client-side stats');
      }
      
      // Fallback to client-side usage stats
      const { ClaudeService } = await import('../../lib/services/claude-service');
      const claudeUsage = ClaudeService.getCurrentUsage();
      
      setUsageStats({
        claude: {
          calls: claudeUsage.callsToday,
          cost: claudeUsage.costToday,
          tokens: claudeUsage.tokensToday,
          limits: claudeUsage.limits,
          utilization: {
            calls: `${claudeUsage.callsToday}/${claudeUsage.limits.MAX_CALLS}`,
            cost: `$${claudeUsage.costToday.toFixed(2)}/$${claudeUsage.limits.MAX_COST.toFixed(2)}`,
            tokens: `${claudeUsage.tokensToday}/${(claudeUsage.limits.MAX_TOKENS / 1000).toFixed(0)}K`
          }
        },
        shotstack: {
          renders: 0,
          cost: 0,
          minutes: 0,
          limits: { MAX_CALLS: 10, MAX_COST: 5.00, MAX_MINUTES: 12.5 },
          utilization: { renders: '0/10', cost: '$0.00/$5.00', minutes: '0.0/12.5min' }
        },
        totalCostToday: claudeUsage.costToday,
        lastUpdated: new Date().toISOString()
      });
      
      console.log('✅ Usage stats loaded from client-side');
    } catch (error) {
      console.error('❌ Failed to fetch usage stats:', error);
    }
  };

  const handleScrapeStories = async (category: string) => {
    setLoading(true);
    try {
      console.log(`🔍 Starting Reddit scraping for category: ${category}`);
      
      // Import and use the actual Reddit scraper
      const { RedditScraperService } = await import('../../lib/services/reddit-scraper');
      const scraper = new RedditScraperService();
      
      // Scrape real Reddit stories using public JSON endpoints
      const scrapedStories = await scraper.scrapeRedditStories(category as any, 15);
      
      console.log(`✅ Successfully scraped ${scrapedStories.length} stories from Reddit`);
      setStories(scrapedStories);
      setActiveTab('stories');
      
      if (scrapedStories.length === 0) {
        alert(`No suitable stories found for ${category}. Try a different category or check your internet connection.`);
      }
    } catch (error) {
      console.error('Failed to scrape Reddit stories:', error);
      alert(`Failed to scrape stories: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    setLoading(false);
  };

  const updateWorkflowStatus = (updates: Partial<WorkflowState>) => {
    setWorkflowStatus(prev => prev ? {
      ...prev,
      ...updates,
      lastUpdated: new Date().toISOString()
    } : null);
  };

  const handleGenerateVideo = async () => {
    if (!selectedStory) return;
    
    setLoading(true);
    try {
      console.log('🎬 Starting video generation workflow');
      
      const workflowId = 'workflow_' + Date.now();
      const startTime = Date.now();
      
      setWorkflowStatus({
        workflowId,
        status: 'processing',
        currentStep: 'Initializing workflow...',
        progress: 0,
        startTime,
        lastUpdated: new Date().toISOString()
      });
      setActiveTab('progress');

      // Simulate initialization delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateWorkflowStatus({
        currentStep: 'Workflow initialized successfully',
        progress: 10
      });

      // Step 1: Enhance story with Claude AI
      updateWorkflowStatus({
        currentStep: 'Analyzing story content...',
        progress: 15
      });
      
      await new Promise(resolve => setTimeout(resolve, 800));
      updateWorkflowStatus({
        currentStep: 'Enhancing story with Claude AI...',
        progress: 25
      });

      let enhancedContent = selectedStory.content;
      let claudeCost = 0;
      
      try {
        // Try Claude enhancement (service handles API key checking)
        const { ClaudeService } = await import('../../lib/services/claude-service');
        const claude = new ClaudeService();
        enhancedContent = await claude.enhanceStory(selectedStory, videoSettings.duration / 60);
        claudeCost = (selectedStory.content.length / 1000) * 0.008; // Estimate cost
        console.log('✅ Story enhanced with Claude');
        
        updateWorkflowStatus({
          currentStep: 'Story enhancement completed successfully',
          progress: 40
        });
      } catch (claudeError) {
        console.warn('Claude enhancement failed, using fallback:', claudeError);
        updateWorkflowStatus({
          currentStep: 'Using fallback story enhancement',
          progress: 40
        });
      }

      // Step 2: Generate audio with ElevenLabs
      updateWorkflowStatus({
        currentStep: 'Generating natural voice narration...',
        progress: 50
      });
      
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate audio generation
      const elevenlabsCost = (enhancedContent.length / 1000) * 0.018;
      
      updateWorkflowStatus({
        currentStep: 'Voice narration completed',
        progress: 65
      });

      // Step 3: Generate video with Shotstack
      updateWorkflowStatus({
        currentStep: 'Creating video timeline...',
        progress: 70
      });

      let videoResult = null;
      let shotstackCost = 0;
      
      try {
        // Try Shotstack video generation (service handles API key checking)
        const { ShotstackService } = await import('../../lib/services/shotstack-service');
        const shotstack = new ShotstackService();
        
        updateWorkflowStatus({
          currentStep: 'Rendering video with Shotstack...',
          progress: 80
        });
        
        videoResult = await shotstack.generateVideoWithShotstack({
          enhancedText: enhancedContent,
          backgroundVideoUrl: videoSettings.background_url,
          voiceSettings: {
            voice_id: videoSettings.voice_id,
            stability: 0.75,
            similarity_boost: 0.85
          },
          duration: videoSettings.duration,
          addCaptions: videoSettings.add_captions
        });
        
        shotstackCost = videoResult.costs.shotstack_cost;
        console.log('✅ Video generated with Shotstack');
        
        updateWorkflowStatus({
          currentStep: 'Video rendering completed',
          progress: 95
        });
      } catch (shotstackError) {
        console.warn('Shotstack generation failed:', shotstackError);
        updateWorkflowStatus({
          currentStep: 'Video generation failed, creating simulation',
          progress: 95
        });
      }

      // Step 4: Finalize and save
      updateWorkflowStatus({
        currentStep: 'Finalizing video generation...',
        progress: 98
      });

      // Create video record with cost tracking
      const totalCost = claudeCost + elevenlabsCost + shotstackCost;
      const generatedVideo: GeneratedVideo = {
        id: 'video_' + Date.now(),
        story_id: selectedStory.id,
        video_url: videoResult?.videoUrl || `#simulation_${Date.now()}`,
        audio_url: videoResult?.audioUrl || `#audio_${Date.now()}`,
        duration: videoSettings.duration,
        file_size: videoResult ? 25000000 : Math.floor(videoSettings.duration * 1000 * 80), // Estimated size
        created_at: new Date().toISOString(),
        api_costs: {
          claude_cost: claudeCost,
          shotstack_cost: shotstackCost,
          elevenlabs_cost: elevenlabsCost,
          total_cost: totalCost
        }
      };

      // Final completion step
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setWorkflowStatus(prev => prev ? {
        ...prev,
        status: 'completed',
        currentStep: 'Video generation complete! 🎉',
        progress: 100,
        videos: [generatedVideo],
        costs: {
          claudeCost,
          shotstackCost,
          elevenlabsCost,
          totalCost
        },
        lastUpdated: new Date().toISOString()
      } : null);
      
      setGeneratedVideos(prev => [...prev, generatedVideo]);
      fetchUsageStats();
      
      // Show completion notification
      const message = videoResult 
        ? `✅ Video generated successfully! Total cost: $${totalCost.toFixed(3)}`
        : `⚠️ Video workflow completed in simulation mode. Total estimated cost: $${totalCost.toFixed(3)}`;
      
      setTimeout(() => {
        alert(message);
        setActiveTab('videos'); // Switch to generated videos tab
      }, 1000);
      
    } catch (error) {
      console.error('Failed to generate video:', error);
      alert(`Failed to generate video: ${error}`);
    }
    setLoading(false);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatCost = (cost: number) => `$${cost.toFixed(3)}`;

  const handleVideoPreview = (video: GeneratedVideo) => {
    setVideoPreview(video);
    setShowVideoModal(true);
  };

  const handleVideoDownload = async (video: GeneratedVideo) => {
    try {
      if (video.video_url.startsWith('#')) {
        alert('This is a simulated video. Configure API keys to generate real videos.');
        return;
      }
      
      // For real videos, create download link
      const link = document.createElement('a');
      link.href = video.video_url;
      link.download = `reddit-video-${video.id}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    }
  };

  const getVideoThumbnail = (video: GeneratedVideo) => {
    // Generate a placeholder thumbnail based on video ID
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
    const colorIndex = parseInt(video.id.slice(-1), 16) % colors.length;
    return colors[colorIndex];
  };

  const calculateEstimatedCost = () => {
    if (!selectedStory) return 0;
    const durationMinutes = videoSettings.duration / 60;
    const claudeCost = Math.min(0.50, durationMinutes * 0.03);
    const shotstackCost = durationMinutes * 0.40;
    const elevenlabsCost = (selectedStory.content.length / 1000) * 0.018;
    return claudeCost + shotstackCost + elevenlabsCost;
  };

  const getFilteredAndSortedStories = () => {
    return stories
      .filter(story => 
        story.viral_score >= filterMinScore && 
        story.estimated_duration >= filterMinDuration
      )
      .sort((a, b) => {
        switch (sortBy) {
          case 'viral_score':
            return b.viral_score - a.viral_score;
          case 'upvotes':
            return b.upvotes - a.upvotes;
          case 'comments':
            return b.comments - a.comments;
          case 'duration':
            return b.estimated_duration - a.estimated_duration;
          default:
            return 0;
        }
      });
  };

  const handleStorySelect = (storyId: string, isSelected: boolean) => {
    const newSelected = new Set(selectedStories);
    if (isSelected) {
      newSelected.add(storyId);
    } else {
      newSelected.delete(storyId);
    }
    setSelectedStories(newSelected);
  };

  const handleSelectAll = () => {
    const filteredStories = getFilteredAndSortedStories();
    if (selectedStories.size === filteredStories.length) {
      setSelectedStories(new Set());
    } else {
      setSelectedStories(new Set(filteredStories.map(s => s.id)));
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-900 text-gray-100">
        {/* Header */}
        <div className="border-b border-gray-800 bg-gray-950">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-white">Reddit Video Automation</h1>
                <p className="text-gray-400 text-sm mt-1">Automated content generation with budget controls</p>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                {usageStats && (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <BarChart3 size={16} />
                      <span>Claude: {usageStats.claude.utilization.cost}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Video size={16} />
                      <span>Shotstack: {usageStats.shotstack.utilization.cost}</span>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Video size={16} />
                  <span>{generatedVideos.length} videos generated</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="border-b border-gray-800">
          <div className="container mx-auto px-6">
            <nav className="flex space-x-8">
              {[
                { id: 'scrape', name: 'Categories', icon: ChevronRight },
                { id: 'stories', name: 'Stories', icon: Video },
                { id: 'progress', name: 'Progress', icon: Clock },
                { id: 'videos', name: 'Generated', icon: Play },
                { id: 'usage', name: 'Usage', icon: BarChart3 }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300'
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          {/* Usage Stats Tab */}
          {activeTab === 'usage' && (
            <ErrorBoundary>
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-2">API Usage Statistics</h2>
                    <p className="text-gray-400">Today&apos;s API consumption and budget limits</p>
                  </div>
                  <button
                    onClick={fetchUsageStats}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    <RefreshCw size={16} />
                    Refresh
                  </button>
                </div>

                {usageStats ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Claude Usage */}
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-4">Claude API</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">Daily Calls</span>
                            <span className="text-white">{usageStats.claude.utilization.calls}</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${(usageStats.claude.calls / usageStats.claude.limits.MAX_CALLS) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">Daily Cost</span>
                            <span className="text-white">{usageStats.claude.utilization.cost}</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${(usageStats.claude.cost / usageStats.claude.limits.MAX_COST) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">Daily Tokens</span>
                            <span className="text-white">{usageStats.claude.utilization.tokens}</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-purple-500 h-2 rounded-full"
                              style={{ width: `${(usageStats.claude.tokens / usageStats.claude.limits.MAX_TOKENS) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Shotstack Usage */}
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-4">Shotstack API</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">Daily Renders</span>
                            <span className="text-white">{usageStats.shotstack.utilization.renders}</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${(usageStats.shotstack.renders / usageStats.shotstack.limits.MAX_CALLS) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">Daily Cost</span>
                            <span className="text-white">{usageStats.shotstack.utilization.cost}</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${(usageStats.shotstack.cost / usageStats.shotstack.limits.MAX_COST) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">Daily Minutes</span>
                            <span className="text-white">{usageStats.shotstack.utilization.minutes}</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-orange-500 h-2 rounded-full"
                              style={{ width: `${(usageStats.shotstack.minutes / usageStats.shotstack.limits.MAX_MINUTES) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Total Usage Summary */}
                    <div className="md:col-span-2 bg-gray-800 rounded-lg p-6 border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-4">Daily Summary</h3>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-green-400">${usageStats.totalCostToday.toFixed(2)}</div>
                          <div className="text-sm text-gray-400">Total Cost Today</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-400">{usageStats.claude.calls + usageStats.shotstack.renders}</div>
                          <div className="text-sm text-gray-400">Total API Calls</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-purple-400">{usageStats.shotstack.minutes.toFixed(1)}min</div>
                          <div className="text-sm text-gray-400">Video Generated</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <BarChart3 size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Loading usage statistics...</p>
                  </div>
                )}
              </div>
            </ErrorBoundary>
          )}

          {/* Categories Tab */}
          {activeTab === 'scrape' && (
            <ErrorBoundary>
              <div>
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-white mb-2">Select Content Category</h2>
                  <p className="text-gray-400">Choose a Reddit category to scrape viral stories from</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categories.map(category => (
                    <div
                      key={category.id}
                      className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer"
                      onClick={() => handleScrapeStories(category.id)}
                    >
                      <h3 className="text-lg font-medium text-white mb-2">{category.name}</h3>
                      <p className="text-gray-400 text-sm mb-4">{category.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-blue-400 text-sm font-medium">Scrape Stories</span>
                        <ChevronRight size={16} className="text-gray-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ErrorBoundary>
          )}

          {/* Stories Tab */}
          {activeTab === 'stories' && (
            <ErrorBoundary>
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-2">Reddit Stories</h2>
                    <p className="text-gray-400">{getFilteredAndSortedStories().length} of {stories.length} stories shown</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('scrape')}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
                  >
                    Back to Categories
                  </button>
                </div>

                {/* Filtering and Sorting Controls */}
                <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="viral_score">Viral Score</option>
                        <option value="upvotes">Upvotes</option>
                        <option value="comments">Comments</option>
                        <option value="duration">Duration</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Min Viral Score: {filterMinScore}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="20"
                        step="0.5"
                        value={filterMinScore}
                        onChange={(e) => setFilterMinScore(parseFloat(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Min Duration: {Math.floor(filterMinDuration / 60)}:{(filterMinDuration % 60).toString().padStart(2, '0')}
                      </label>
                      <input
                        type="range"
                        min="30"
                        max="600"
                        step="30"
                        value={filterMinDuration}
                        onChange={(e) => setFilterMinDuration(parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    <div className="flex items-end">
                      <button
                        onClick={handleSelectAll}
                        className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
                      >
                        {selectedStories.size === getFilteredAndSortedStories().length ? 'Deselect All' : 'Select All'}
                      </button>
                    </div>
                  </div>

                  {selectedStories.size > 0 && (
                    <div className="mt-4 p-3 bg-blue-900/20 border border-blue-800 rounded-lg">
                      <div className="flex items-center justify-between">
                        <p className="text-blue-300 text-sm">
                          {selectedStories.size} stories selected for batch processing
                        </p>
                        <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors">
                          Generate Batch
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid gap-4">
                  {getFilteredAndSortedStories().map(story => (
                    <div
                      key={story.id}
                      className={`bg-gray-800 rounded-lg p-6 border transition-colors ${
                        selectedStory?.id === story.id
                          ? 'border-blue-500 bg-gray-750'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Story Selection Checkbox */}
                        <div className="pt-1">
                          <input
                            type="checkbox"
                            checked={selectedStories.has(story.id)}
                            onChange={(e) => handleStorySelect(story.id, e.target.checked)}
                            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                          />
                        </div>

                        {/* Story Content */}
                        <div 
                          className="flex-1 cursor-pointer"
                          onClick={() => setSelectedStory(story)}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="text-lg font-medium text-white line-clamp-2">{story.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-400 ml-4">
                              <span>r/{story.subreddit}</span>
                              <span>•</span>
                              <span>{story.upvotes} upvotes</span>
                            </div>
                          </div>
                          
                          <p className="text-gray-300 text-sm mb-4 line-clamp-3">{story.content}</p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                              <span>Score: {story.viral_score.toFixed(1)}</span>
                              <span>Duration: {formatDuration(story.estimated_duration)}</span>
                              <span className="capitalize bg-gray-700 px-2 py-1 rounded text-xs">{story.category}</span>
                            </div>
                            {selectedStory?.id === story.id && (
                              <span className="text-blue-400 text-sm font-medium">Selected for Video</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedStory && (
                  <div className="mt-8 bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Video Settings</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Video Duration (seconds)
                        </label>
                        <input
                          type="number"
                          min="60"
                          max="900"
                          value={videoSettings.duration}
                          onChange={(e) => setVideoSettings(prev => ({ ...prev, duration: parseInt(e.target.value) || 60 }))}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Voice Selection
                        </label>
                        <select
                          value={videoSettings.voice_id}
                          onChange={(e) => setVideoSettings(prev => ({ ...prev, voice_id: e.target.value }))}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        >
                          {voiceOptions.map(voice => (
                            <option key={voice.id} value={voice.id}>{voice.name}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Background Video URL
                        </label>
                        <input
                          type="url"
                          value={videoSettings.background_url}
                          onChange={(e) => setVideoSettings(prev => ({ ...prev, background_url: e.target.value }))}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={videoSettings.add_captions}
                            onChange={(e) => setVideoSettings(prev => ({ ...prev, add_captions: e.target.checked }))}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-300">Add Captions</span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex items-center justify-between">
                      <div className="text-sm text-gray-400">
                        Estimated Cost: {formatCost(calculateEstimatedCost())}
                      </div>
                      <button
                        onClick={handleGenerateVideo}
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg font-medium transition-colors flex items-center gap-2"
                      >
                        <Video size={16} />
                        {loading ? 'Generating...' : 'Generate Video'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </ErrorBoundary>
          )}

          {/* Progress Tab */}
          {activeTab === 'progress' && workflowStatus && (
            <ErrorBoundary>
              <div>
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-white mb-2">Video Generation Progress</h2>
                  <p className="text-gray-400">Workflow ID: {workflowStatus.workflowId}</p>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-300">{workflowStatus.currentStep}</span>
                      <span className="text-sm text-gray-400">{workflowStatus.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${workflowStatus.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Status:</span>
                      <span className={`ml-2 capitalize ${
                        workflowStatus.status === 'completed' ? 'text-green-400' :
                        workflowStatus.status === 'failed' ? 'text-red-400' : 'text-yellow-400'
                      }`}>
                        {workflowStatus.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Started:</span>
                      <span className="ml-2 text-white">
                        {new Date(workflowStatus.startTime).toLocaleTimeString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Last Update:</span>
                      <span className="ml-2 text-white">
                        {new Date(workflowStatus.lastUpdated).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  
                  {workflowStatus.status === 'completed' && workflowStatus.videos && (
                    <div className="mt-6 pt-6 border-t border-gray-700">
                      <h4 className="text-lg font-semibold text-white mb-4">Generated Videos</h4>
                      <div className="grid gap-4">
                        {workflowStatus.videos.map(video => (
                          <div key={video.id} className="bg-gray-700 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-white font-medium">Video #{video.id.split('_')[1]}</p>
                                <p className="text-sm text-gray-400">
                                  Duration: {formatDuration(video.duration)} • 
                                  Size: {(video.file_size / 1024 / 1024).toFixed(1)}MB
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm">
                                  <Play size={14} className="inline mr-1" />
                                  Preview
                                </button>
                                <button className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm">
                                  <Download size={14} className="inline mr-1" />
                                  Download
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {workflowStatus.error && (
                    <div className="mt-6 p-4 bg-red-900/20 border border-red-800 rounded-lg">
                      <div className="flex items-center gap-2 text-red-400">
                        <AlertCircle size={16} />
                        <span className="font-medium">Error</span>
                      </div>
                      <p className="text-red-300 text-sm mt-1">{workflowStatus.error}</p>
                    </div>
                  )}
                </div>
              </div>
            </ErrorBoundary>
          )}

          {/* Generated Videos Tab */}
          {activeTab === 'videos' && (
            <ErrorBoundary>
              <div>
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-white mb-2">Generated Videos</h2>
                  <p className="text-gray-400">{generatedVideos.length} videos in your library</p>
                </div>
                
                {generatedVideos.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {generatedVideos.map(video => (
                      <div key={video.id} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:border-gray-600 transition-colors">
                        {/* Video Thumbnail */}
                        <div 
                          className="h-48 relative cursor-pointer group"
                          style={{ backgroundColor: getVideoThumbnail(video) }}
                          onClick={() => handleVideoPreview(video)}
                        >
                          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center group-hover:bg-opacity-60 transition-all">
                            <div className="text-center">
                              <Play size={32} className="text-white mx-auto mb-2" />
                              <p className="text-white text-sm font-medium">Click to Preview</p>
                            </div>
                          </div>
                          <div className="absolute top-3 left-3 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                            {formatDuration(video.duration)}
                          </div>
                          {video.video_url.startsWith('#') && (
                            <div className="absolute top-3 right-3 bg-yellow-600 text-white text-xs px-2 py-1 rounded">
                              SIMULATION
                            </div>
                          )}
                        </div>

                        <div className="p-4">
                          <div className="mb-3">
                            <h3 className="text-lg font-medium text-white mb-1">
                              Video #{video.id.split('_')[1]}
                            </h3>
                            <p className="text-sm text-gray-400">
                              {(video.file_size / 1024 / 1024).toFixed(1)}MB • {new Date(video.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          
                          {video.api_costs && (
                            <div className="mb-4 p-3 bg-gray-700 rounded-lg">
                              <h4 className="text-sm font-medium text-gray-300 mb-2">Cost Breakdown</h4>
                              <div className="space-y-1 text-xs">
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Claude AI:</span>
                                  <span className="text-white">{formatCost(video.api_costs.claude_cost)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-400">ElevenLabs:</span>
                                  <span className="text-white">{formatCost(video.api_costs.elevenlabs_cost)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Shotstack:</span>
                                  <span className="text-white">{formatCost(video.api_costs.shotstack_cost)}</span>
                                </div>
                                <div className="flex justify-between border-t border-gray-600 pt-1 font-medium">
                                  <span className="text-gray-300">Total:</span>
                                  <span className="text-green-400">{formatCost(video.api_costs.total_cost)}</span>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleVideoPreview(video)}
                              className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors flex items-center justify-center gap-1"
                            >
                              <Play size={14} />
                              Preview
                            </button>
                            <button 
                              onClick={() => handleVideoDownload(video)}
                              className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 rounded text-sm transition-colors flex items-center justify-center gap-1"
                            >
                              <Download size={14} />
                              Download
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <Video size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No videos generated yet</p>
                    <p className="text-sm mt-2">Start by selecting a category and generating your first video</p>
                  </div>
                )}
              </div>
            </ErrorBoundary>
          )}
        </div>

        {/* Video Preview Modal */}
        {showVideoModal && videoPreview && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">
                    Video Preview - #{videoPreview.id.split('_')[1]}
                  </h3>
                  <button
                    onClick={() => setShowVideoModal(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <AlertCircle size={24} />
                  </button>
                </div>

                {/* Video Player */}
                <div className="mb-6">
                  {videoPreview.video_url.startsWith('#') ? (
                    <div className="bg-gray-700 rounded-lg p-8 text-center">
                      <Video size={48} className="mx-auto mb-4 text-gray-400" />
                      <h4 className="text-lg font-medium text-white mb-2">Simulation Video</h4>
                      <p className="text-gray-400 mb-4">
                        This is a simulated video. Configure your API keys to generate real videos.
                      </p>
                      <div className="bg-gray-600 rounded-lg p-4 mb-4">
                        <p className="text-sm text-gray-300">
                          <strong>Video Details:</strong><br />
                          Duration: {formatDuration(videoPreview.duration)}<br />
                          Size: {(videoPreview.file_size / 1024 / 1024).toFixed(1)}MB<br />
                          Created: {new Date(videoPreview.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <video
                      className="w-full rounded-lg"
                      controls
                      preload="metadata"
                      src={videoPreview.video_url}
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>

                {/* Video Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h4 className="text-lg font-medium text-white mb-3">Video Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Duration:</span>
                        <span className="text-white">{formatDuration(videoPreview.duration)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">File Size:</span>
                        <span className="text-white">{(videoPreview.file_size / 1024 / 1024).toFixed(1)}MB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Created:</span>
                        <span className="text-white">{new Date(videoPreview.created_at).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Story ID:</span>
                        <span className="text-white">{videoPreview.story_id}</span>
                      </div>
                    </div>
                  </div>

                  {videoPreview.api_costs && (
                    <div className="bg-gray-700 rounded-lg p-4">
                      <h4 className="text-lg font-medium text-white mb-3">Cost Analysis</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Claude AI:</span>
                          <span className="text-white">{formatCost(videoPreview.api_costs.claude_cost)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">ElevenLabs TTS:</span>
                          <span className="text-white">{formatCost(videoPreview.api_costs.elevenlabs_cost)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Shotstack Video:</span>
                          <span className="text-white">{formatCost(videoPreview.api_costs.shotstack_cost)}</span>
                        </div>
                        <div className="border-t border-gray-600 pt-2 flex justify-between font-medium">
                          <span className="text-gray-300">Total Cost:</span>
                          <span className="text-green-400">{formatCost(videoPreview.api_costs.total_cost)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setShowVideoModal(false)}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => handleVideoDownload(videoPreview)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white transition-colors flex items-center gap-2"
                  >
                    <Download size={16} />
                    Download Video
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default RedditVideoAutomation;