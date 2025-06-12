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
      // For now, show empty stats since API routes are disabled for static export
      setUsageStats({
        claude: {
          calls: 0,
          cost: 0,
          tokens: 0,
          limits: { MAX_CALLS: 20, MAX_COST: 1.00, MAX_TOKENS: 200000 },
          utilization: { calls: '0/20', cost: '$0.00/$1.00', tokens: '0/200K' }
        },
        shotstack: {
          renders: 0,
          cost: 0,
          minutes: 0,
          limits: { MAX_CALLS: 10, MAX_COST: 5.00, MAX_MINUTES: 12.5 },
          utilization: { renders: '0/10', cost: '$0.00/$5.00', minutes: '0.0/12.5min' }
        },
        totalCostToday: 0
      });
    } catch (error) {
      console.error('Failed to fetch usage stats:', error);
    }
  };

  const handleScrapeStories = async (category: string) => {
    setLoading(true);
    try {
      // TODO: Replace with actual Reddit scraper service when API keys are configured
      // For now, show empty state until real data is available
      setStories([]);
      setActiveTab('stories');
      console.log(`Reddit scraping initiated for category: ${category}`);
      console.log('No API keys configured - showing empty state');
    } catch (error) {
      console.error('Failed to scrape stories:', error);
      alert(`Failed to scrape stories: ${error}`);
    }
    setLoading(false);
  };

  const handleGenerateVideo = async () => {
    if (!selectedStory) return;
    
    setLoading(true);
    try {
      // TODO: Replace with actual video generation workflow when API keys are configured
      // For now, show error since no real stories are available
      console.log('Video generation attempted but no API services configured');
      alert('Video generation requires API configuration. Please set up Reddit, Claude, and Shotstack APIs first.');
      setActiveTab('stories');
      
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

  const calculateEstimatedCost = () => {
    if (!selectedStory) return 0;
    const durationMinutes = videoSettings.duration / 60;
    const claudeCost = Math.min(0.50, durationMinutes * 0.03);
    const shotstackCost = durationMinutes * 0.40;
    const elevenlabsCost = (selectedStory.content.length / 1000) * 0.018;
    return claudeCost + shotstackCost + elevenlabsCost;
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
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-2">Reddit Stories</h2>
                    <p className="text-gray-400">{stories.length} stories found</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('scrape')}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
                  >
                    Back to Categories
                  </button>
                </div>

                <div className="grid gap-4">
                  {stories.map(story => (
                    <div
                      key={story.id}
                      className={`bg-gray-800 rounded-lg p-6 border transition-colors cursor-pointer ${
                        selectedStory?.id === story.id
                          ? 'border-blue-500 bg-gray-750'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
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
                          <span className="text-blue-400 text-sm font-medium">Selected</span>
                        )}
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
                      <div key={video.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <div className="mb-4">
                          <h3 className="text-lg font-medium text-white mb-2">Video #{video.id.split('_')[1]}</h3>
                          <p className="text-sm text-gray-400">
                            {formatDuration(video.duration)} • {(video.file_size / 1024 / 1024).toFixed(1)}MB
                          </p>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Created:</span>
                            <span className="text-white">{new Date(video.created_at).toLocaleDateString()}</span>
                          </div>
                          {video.api_costs && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Total Cost:</span>
                              <span className="text-white">{formatCost(video.api_costs.total_cost)}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <button className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors">
                            <Play size={14} className="inline mr-1" />
                            Preview
                          </button>
                          <button className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 rounded text-sm transition-colors">
                            <Download size={14} className="inline mr-1" />
                            Download
                          </button>
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
      </div>
    </ErrorBoundary>
  );
};

export default RedditVideoAutomation;