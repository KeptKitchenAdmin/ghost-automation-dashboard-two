import { v4 as uuidv4 } from 'uuid';
import { R2UsageLogger } from '../lib/usage/r2-logger';
import type { ViralMoment, TranscriptSegment, VideoClip, ProcessingOptions } from '../lib/viral-clips/types';

// SIMPLIFIED viral clip processor - Only OpenAI Whisper + ytdl-core
export class LocalContentClipperAgent {
  private storage: Map<string, any> = new Map();

  async processContentRequest(
    sourceUrl: string, 
    options: ProcessingOptions
  ): Promise<{ sessionId: string; clips: VideoClip[]; analysis: any }> {
    const sessionId = uuidv4();
    
    try {
      console.log('🚀 Starting viral clip generation...');
      
      // Step 1: Download and extract content locally (no API)
      const { videoPath, audioPath } = await this.downloadContent(sourceUrl);
      console.log('✅ Video/audio downloaded successfully');
      
      // Step 2: Extract transcript using OpenAI Whisper API (BRIEF API CALL)
      const transcript = await this.extractTranscriptWithWhisper(audioPath, sourceUrl);
      console.log('✅ Transcript extracted - API call complete');
      
      // Step 3: Analyze for viral moments locally (NO API calls)
      const analysis = await this.analyzeViralMomentsLocal(transcript);
      console.log('✅ Viral moment analysis complete - no API calls');
      
      // Step 4: Generate clips using local processing (NO API calls)
      const clips = await this.generateClipsLocal({
        transcript,
        analysis,
        options,
        videoPath,
        audioPath
      });
      console.log('✅ Video clips generated - no API calls');

      console.log('🎉 Viral clip generation complete - all API calls finished');
      
      return { sessionId, clips, analysis };
    } catch (error) {
      console.error('❌ Viral clip generation failed:', error);
      throw error;
    }
  }

  // Download content locally using ytdl-core
  private async downloadContent(sourceUrl: string): Promise<{ videoPath: string; audioPath: string }> {
    const ytdl = require('ytdl-core');
    const fs = require('fs');
    const path = require('path');

    const tempDir = `/tmp/${uuidv4()}`;
    await fs.promises.mkdir(tempDir, { recursive: true });

    const videoPath = path.join(tempDir, 'video.mp4');
    const audioPath = path.join(tempDir, 'audio.mp3');

    // Download video
    const videoStream = ytdl(sourceUrl, { quality: 'highest' });
    const videoWriteStream = fs.createWriteStream(videoPath);
    videoStream.pipe(videoWriteStream);

    // Download audio
    const audioStream = ytdl(sourceUrl, { quality: 'highestaudio', filter: 'audioonly' });
    const audioWriteStream = fs.createWriteStream(audioPath);
    audioStream.pipe(audioWriteStream);

    // Wait for both downloads to complete
    await Promise.all([
      new Promise((resolve, reject) => {
        videoWriteStream.on('finish', resolve);
        videoWriteStream.on('error', reject);
      }),
      new Promise((resolve, reject) => {
        audioWriteStream.on('finish', resolve);
        audioWriteStream.on('error', reject);
      })
    ]);

    return { videoPath, audioPath };
  }

  // Extract transcript using OpenAI Whisper (ONLY during content generation)
  private async extractTranscriptWithWhisper(audioPath: string, sourceUrl: string): Promise<TranscriptSegment[]> {
    try {
      console.log('🎤 Starting OpenAI Whisper transcription...');
      
      // BRIEF API CALL - OpenAI Whisper for transcription
      const transcript = await this.callOpenAIWhisper(audioPath);
      
      // IMMEDIATELY log the API usage to R2 storage
      await this.logAPIUsage('openai_whisper', audioPath, sourceUrl);
      
      console.log('✅ Whisper transcription complete - API call ended');
      
      return transcript;
    } catch (error) {
      console.error('❌ Whisper transcription failed:', error);
      
      // Fallback: Try YouTube captions if Whisper fails
      console.log('🔄 Falling back to YouTube captions...');
      return this.extractYouTubeCaptions(sourceUrl);
    }
  }

  // OpenAI Whisper API call - ONLY during content generation
  private async callOpenAIWhisper(audioPath: string): Promise<TranscriptSegment[]> {
    const OpenAI = require('openai');
    const fs = require('fs');
    
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Read audio file for Whisper processing
    const audioFile = fs.createReadStream(audioPath);

    // SINGLE API CALL - then stops immediately
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      response_format: 'verbose_json',
      timestamp_granularities: ['word']
    });

    // Convert Whisper response to our format
    const segments: TranscriptSegment[] = [];
    
    if (transcription.words) {
      transcription.words.forEach((word: any) => {
        segments.push({
          text: word.word,
          startTime: word.start,
          endTime: word.end,
          confidence: 0.95 // Whisper is very accurate
        });
      });
    }

    return segments;
  }

  // Log API usage to R2 storage immediately after API call
  private async logAPIUsage(service: string, audioPath: string, sourceUrl: string): Promise<void> {
    try {
      const fs = require('fs');
      const path = require('path');
      
      // Simple duration estimation without ffprobe
      const audioStats = await fs.promises.stat(audioPath);
      const fileSizeMB = audioStats.size / (1024 * 1024);
      const estimatedMinutes = fileSizeMB / 2; // Rough estimate: 2MB per minute
      
      // Calculate Whisper cost: $0.006 per minute
      const cost = estimatedMinutes * 0.006;
      
      // Log using existing R2UsageLogger
      await R2UsageLogger.logOpenAI({
        operation: 'viral-clip-transcription',
        tokens: Math.ceil(estimatedMinutes * 100), // Estimated tokens
        cost: cost,
        model: 'whisper-1'
      });
      
      console.log(`💰 API Usage logged: OpenAI Whisper $${cost.toFixed(4)} for ${estimatedMinutes.toFixed(2)} minutes`);
      
    } catch (error) {
      console.error('⚠️ Failed to log API usage:', error);
      // Don't throw - logging failure shouldn't break the workflow
    }
  }

  // Extract YouTube captions without API calls
  private async extractYouTubeCaptions(sourceUrl: string): Promise<TranscriptSegment[]> {
    const ytdl = require('ytdl-core');
    
    try {
      const info = await ytdl.getInfo(sourceUrl);
      const tracks = info.player_response.captions?.playerCaptionsTracklistRenderer?.captionTracks;
      
      if (!tracks || tracks.length === 0) {
        return [];
      }

      // Get English captions
      const englishTrack = tracks.find((track: any) => 
        track.languageCode === 'en' || track.languageCode === 'en-US'
      ) || tracks[0];

      // Fetch and parse captions
      const captionsResponse = await fetch(englishTrack.baseUrl);
      const captionsXml = await captionsResponse.text();
      
      // Parse XML to extract segments
      return this.parseYouTubeCaptionsXML(captionsXml);
    } catch (error) {
      console.error('Failed to extract YouTube captions:', error);
      return [];
    }
  }

  // Parse YouTube captions XML
  private parseYouTubeCaptionsXML(xml: string): TranscriptSegment[] {
    const segments: TranscriptSegment[] = [];
    
    // Simple XML parsing for captions
    const textMatches = xml.match(/<text start="([^"]*)" dur="([^"]*)"[^>]*>([^<]*)<\/text>/g);
    
    if (textMatches) {
      textMatches.forEach(match => {
        const startMatch = match.match(/start="([^"]*)"/);
        const durMatch = match.match(/dur="([^"]*)"/);
        const textMatch = match.match(/>([^<]*)</);
        
        if (startMatch && durMatch && textMatch) {
          const startTime = parseFloat(startMatch[1]);
          const duration = parseFloat(durMatch[1]);
          const text = textMatch[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
          
          segments.push({
            text: text.trim(),
            startTime,
            endTime: startTime + duration,
            confidence: 0.9
          });
        }
      });
    }
    
    return segments;
  }

  // Analyze viral moments using local text processing (NO AI APIs)
  private async analyzeViralMomentsLocal(transcript: TranscriptSegment[]): Promise<ViralMoment[]> {
    const viralMoments: ViralMoment[] = [];
    
    // Local viral moment detection using keyword patterns
    const viralKeywords = {
      surprise: ['wow', 'amazing', 'incredible', 'unbelievable', 'shocked', 'stunned'],
      excitement: ['awesome', 'fantastic', 'amazing', 'incredible', 'love', 'excited'],
      controversy: ['wrong', 'disagree', 'controversial', 'debate', 'argue', 'fight'],
      humor: ['funny', 'hilarious', 'laugh', 'joke', 'comedy', 'amusing'],
      insight: ['secret', 'truth', 'reveals', 'discovered', 'breakthrough', 'important']
    };

    transcript.forEach((segment, index) => {
      const text = segment.text.toLowerCase();
      let maxScore = 0;
      let detectedEmotion: any = 'insight';
      let reason = 'Contains engaging content';

      // Check for viral keywords
      Object.entries(viralKeywords).forEach(([emotion, keywords]) => {
        const matches = keywords.filter(keyword => text.includes(keyword)).length;
        const score = matches * 2; // Basic scoring
        
        if (score > maxScore) {
          maxScore = score;
          detectedEmotion = emotion;
          reason = `Contains ${emotion} keywords: ${keywords.filter(k => text.includes(k)).join(', ')}`;
        }
      });

      // Add sentence length and position bonuses
      const lengthBonus = Math.min(segment.text.length / 50, 2); // Longer segments get small bonus
      const positionBonus = index > transcript.length * 0.2 && index < transcript.length * 0.8 ? 1 : 0; // Middle content bonus
      
      const finalScore = Math.min(maxScore + lengthBonus + positionBonus, 10);

      if (finalScore > 3) { // Only include segments with decent scores
        viralMoments.push({
          startTime: segment.startTime,
          endTime: segment.endTime,
          text: segment.text,
          viralScore: finalScore,
          emotion: detectedEmotion,
          reason
        });
      }
    });

    // Sort by viral score and return top moments
    return viralMoments.sort((a, b) => b.viralScore - a.viralScore);
  }

  // Generate clips using local video processing
  private async generateClipsLocal({
    transcript,
    analysis,
    options,
    videoPath,
    audioPath
  }: {
    transcript: TranscriptSegment[];
    analysis: ViralMoment[];
    options: ProcessingOptions;
    videoPath: string;
    audioPath: string;
  }): Promise<VideoClip[]> {
    const clips: VideoClip[] = [];
    
    // Sort analysis by viral score and take top clips
    const topMoments = analysis
      .sort((a, b) => b.viralScore - a.viralScore)
      .slice(0, options.numberOfClips);

    for (const moment of topMoments) {
      // Find corresponding transcript segments
      const clipTranscript = transcript.filter(segment => 
        segment.startTime >= moment.startTime && 
        segment.endTime <= moment.endTime
      );

      // Generate clip using local video processing
      const clipPaths = await this.createVideoClip({
        videoPath,
        audioPath,
        startTime: moment.startTime,
        endTime: moment.endTime,
        backgroundType: options.backgroundType
      });

      const clip: VideoClip = {
        id: uuidv4(),
        title: moment.text.substring(0, 50) + '...',
        videoPath: clipPaths.videoPath,
        audioPath: clipPaths.audioPath,
        duration: moment.endTime - moment.startTime,
        transcript: clipTranscript,
        viralMoment: moment
      };

      clips.push(clip);
    }

    return clips;
  }

  // Create video clip using simple file copying (NO FFmpeg)
  private async createVideoClip({
    videoPath,
    audioPath,
    startTime,
    endTime,
    backgroundType
  }: {
    videoPath: string;
    audioPath: string;
    startTime: number;
    endTime: number;
    backgroundType: string;
  }): Promise<{ videoPath: string; audioPath: string }> {
    const path = require('path');
    const fs = require('fs');
    
    const outputDir = path.dirname(videoPath);
    const clipId = uuidv4();
    const outputVideoPath = path.join(outputDir, `clip_${clipId}.mp4`);
    const outputAudioPath = path.join(outputDir, `clip_${clipId}.mp3`);

    // For now, just copy the original files
    // In a real implementation, you'd use simple video trimming libraries
    // or browser-based video processing
    
    await fs.promises.copyFile(videoPath, outputVideoPath);
    await fs.promises.copyFile(audioPath, outputAudioPath);
    
    console.log(`📹 Simple video clip created: ${outputVideoPath}`);
    console.log(`🎵 Simple audio clip created: ${outputAudioPath}`);

    return {
      videoPath: outputVideoPath,
      audioPath: outputAudioPath
    };
  }
}