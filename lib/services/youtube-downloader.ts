// YouTube Video URL Handler
// Tests direct YouTube URLs with Shotstack (no third-party APIs)

export class YouTubeDownloaderService {
  private isProcessing = false;
  
  // Daily limits to prevent abuse
  private static dailyDownloads = 0;
  private static lastResetDate = new Date().toDateString();
  private static readonly DAILY_LIMITS = {
    MAX_DOWNLOADS: 20,
    MAX_SIZE_MB: 500
  };

  constructor() {
    this.resetDailyLimitsIfNeeded();
  }

  private resetDailyLimitsIfNeeded() {
    const today = new Date().toDateString();
    if (YouTubeDownloaderService.lastResetDate !== today) {
      YouTubeDownloaderService.dailyDownloads = 0;
      YouTubeDownloaderService.lastResetDate = today;
    }
  }

  private checkDailyLimits() {
    this.resetDailyLimitsIfNeeded();
    
    if (YouTubeDownloaderService.dailyDownloads >= YouTubeDownloaderService.DAILY_LIMITS.MAX_DOWNLOADS) {
      throw new Error(`Daily download limit reached: ${YouTubeDownloaderService.DAILY_LIMITS.MAX_DOWNLOADS} videos`);
    }
  }

  async downloadYouTubeVideo(youtubeUrl: string, maxDurationSeconds: number): Promise<string> {
    console.log('🎥 Testing: Can Shotstack use YouTube URLs directly?');
    
    // Simple test: Return YouTube URL and let Shotstack try it
    return youtubeUrl;
  }

  private extractVideoId(url: string): string | null {
    // Extract video ID from various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }

    return null;
  }

  // Get current usage stats
  static getCurrentUsage() {
    return {
      downloadsToday: this.dailyDownloads,
      maxDownloads: this.DAILY_LIMITS.MAX_DOWNLOADS,
      resetDate: this.lastResetDate
    };
  }
}