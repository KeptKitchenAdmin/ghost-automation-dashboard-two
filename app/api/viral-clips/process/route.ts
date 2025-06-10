
import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { processingJobs, type ProcessingJob } from '../shared/jobStore'

interface ViralClipRequest {
  sourceUrl: string
  backgroundType: 'minecraft' | 'subway_surfers' | 'satisfying' | 'cooking' | 'nature'
  clipDuration: number
  numberOfClips: number
}

// Rate limiting
const requestTracker = new Map<string, { count: number; lastReset: number }>()
const RATE_LIMIT = 5 // Max 5 viral clip jobs per hour
const RATE_WINDOW = 60 * 60 * 1000 // 1 hour

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
  return `viral_clips_${ip}`
}

function checkRateLimit(key: string): boolean {
  const now = Date.now()
  const tracker = requestTracker.get(key)
  
  if (!tracker || now - tracker.lastReset > RATE_WINDOW) {
    requestTracker.set(key, { count: 1, lastReset: now })
    return true
  }
  
  if (tracker.count >= RATE_LIMIT) {
    return false
  }
  
  tracker.count++
  return true
}

async function updateJobProgress(jobId: string, progress: number, step: string, clips: any[] = []) {
  const job = processingJobs.get(jobId)
  if (job) {
    job.progress = progress
    job.currentStep = step
    if (clips.length > 0) {
      job.generatedClips = clips
    }
    processingJobs.set(jobId, job)
    console.log(`📊 Job ${jobId}: ${progress}% - ${step}`)
  }
}

async function markJobComplete(jobId: string, finalClips: any[]) {
  const job = processingJobs.get(jobId)
  if (job) {
    job.status = 'completed'
    job.progress = 100
    job.currentStep = 'All clips generated successfully!'
    job.generatedClips = finalClips
    job.endTime = Date.now()
    processingJobs.set(jobId, job)
    console.log(`✅ Job ${jobId} completed with ${finalClips.length} clips`)
  }
}

async function markJobFailed(jobId: string, error: string) {
  const job = processingJobs.get(jobId)
  if (job) {
    job.status = 'failed'
    job.currentStep = 'Processing failed'
    job.error = error
    job.endTime = Date.now()
    processingJobs.set(jobId, job)
    console.error(`❌ Job ${jobId} failed: ${error}`)
  }
}

// Background processing function
async function processViralClips(jobId: string, options: ViralClipRequest) {
  try {
    console.log(`🚀 Starting viral clip processing for job ${jobId}`)
    
    // Step 1: Extract YouTube transcript (10%)
    await updateJobProgress(jobId, 10, 'Extracting transcript from video...')
    await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate processing
    
    const transcript = await extractTranscript(options.sourceUrl)
    console.log(`📝 Extracted transcript: ${transcript.length} characters`)
    
    // Step 2: Analyze viral moments with AI (30%)
    await updateJobProgress(jobId, 30, 'Analyzing viral moments with AI...')
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const viralMoments = await analyzeViralMoments(transcript, options.numberOfClips)
    console.log(`🔥 Found ${viralMoments.length} viral moments`)
    
    // Step 3: Download source video (50%)
    await updateJobProgress(jobId, 50, 'Downloading source video...')
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const videoPath = await downloadVideo(options.sourceUrl)
    console.log(`📹 Downloaded video to: ${videoPath}`)
    
    // Step 4: Generate clips (70%)
    await updateJobProgress(jobId, 70, 'Generating viral clips...')
    await new Promise(resolve => setTimeout(resolve, 4000))
    
    const clips = []
    for (let i = 0; i < viralMoments.length; i++) {
      const moment = viralMoments[i]
      const clipPath = await generateClip(videoPath, moment, options.clipDuration)
      clips.push({
        id: `clip_${i + 1}`,
        title: moment.title,
        description: moment.description,
        viralScore: moment.viralScore,
        startTime: moment.startTime,
        endTime: moment.endTime,
        duration: options.clipDuration,
        videoUrl: clipPath,
        backgroundType: options.backgroundType
      })
      
      // Update progress as clips are generated
      const clipProgress = 70 + (i + 1) / viralMoments.length * 20
      await updateJobProgress(jobId, clipProgress, `Generated clip ${i + 1}/${viralMoments.length}`, clips)
    }
    
    // Step 5: Add backgrounds and finalize (90%)
    await updateJobProgress(jobId, 90, 'Adding backgrounds and finalizing...')
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const finalClips = await addBackgroundsToClips(clips, options.backgroundType)
    
    // Complete the job
    await markJobComplete(jobId, finalClips)
    
  } catch (error) {
    console.error(`❌ Error processing viral clips for job ${jobId}:`, error)
    await markJobFailed(jobId, error instanceof Error ? error.message : 'Unknown error')
  }
}

// Mock functions - will implement real versions in next sections
async function extractTranscript(sourceUrl: string): Promise<string> {
  // TODO: Implement YouTube transcript extraction
  return `This is a mock transcript from ${sourceUrl}. In the real implementation, this will use YouTube's transcript API or Google Speech-to-Text to extract the actual video transcript. The transcript will contain timestamps and spoken words that we can analyze for viral moments.`
}

async function analyzeViralMoments(transcript: string, numberOfClips: number): Promise<any[]> {
  // TODO: Implement AI viral moment analysis with Claude/OpenAI
  const mockMoments = []
  for (let i = 0; i < numberOfClips; i++) {
    mockMoments.push({
      id: `moment_${i + 1}`,
      title: `Viral Moment ${i + 1}`,
      description: `This is a high-energy moment with great viral potential`,
      viralScore: Math.floor(Math.random() * 30) + 70, // 70-100
      startTime: i * 60, // Mock timestamps
      endTime: (i * 60) + 30,
      transcript: `Mock transcript segment ${i + 1}`,
      reasons: ['High energy', 'Surprising statement', 'Emotional peak']
    })
  }
  return mockMoments
}

async function downloadVideo(sourceUrl: string): Promise<string> {
  // TODO: Implement video download with yt-dlp
  return `/temp/video_${Date.now()}.mp4`
}

async function generateClip(videoPath: string, moment: any, duration: number): Promise<string> {
  // TODO: Implement FFmpeg clip generation
  return `/temp/clip_${moment.id}_${Date.now()}.mp4`
}

async function addBackgroundsToClips(clips: any[], backgroundType: string): Promise<any[]> {
  // TODO: Implement background video composition
  return clips.map(clip => ({
    ...clip,
    finalVideoUrl: `/uploads/viral-clips/final_${clip.id}.mp4`,
    hasBackground: true,
    backgroundType
  }))
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const rateLimitKey = getRateLimitKey(request)
    if (!checkRateLimit(rateLimitKey)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Rate limit exceeded. Maximum 5 viral clip jobs per hour.',
          rateLimitReset: new Date(Date.now() + RATE_WINDOW).toISOString()
        },
        { status: 429 }
      )
    }

    const body: ViralClipRequest = await request.json()
    
    // Validate input
    if (!body.sourceUrl || !body.sourceUrl.match(/^https?:\/\//)) {
      return NextResponse.json(
        { success: false, error: 'Valid source URL is required' },
        { status: 400 }
      )
    }

    if (body.numberOfClips < 1 || body.numberOfClips > 10) {
      return NextResponse.json(
        { success: false, error: 'Number of clips must be between 1 and 10' },
        { status: 400 }
      )
    }

    if (body.clipDuration < 15 || body.clipDuration > 60) {
      return NextResponse.json(
        { success: false, error: 'Clip duration must be between 15 and 60 seconds' },
        { status: 400 }
      )
    }

    // Create processing job
    const jobId = uuidv4()
    const job: ProcessingJob = {
      jobId,
      status: 'processing',
      progress: 0,
      currentStep: 'Initializing viral clip generation...',
      sourceUrl: body.sourceUrl,
      options: body,
      generatedClips: [],
      startTime: Date.now()
    }
    
    processingJobs.set(jobId, job)
    
    console.log(`🚀 Created viral clip job ${jobId} for URL: ${body.sourceUrl}`)
    
    // Start background processing (don't await)
    processViralClips(jobId, body).catch(error => {
      console.error(`Fatal error in job ${jobId}:`, error)
    })
    
    return NextResponse.json({
      success: true,
      jobId,
      message: 'Viral clip generation started',
      estimatedTime: '3-5 minutes'
    })
    
  } catch (error) {
    console.error('❌ Viral clip processing request failed:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to start viral clip processing',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Health check
export async function GET() {
  const activeJobs = Array.from(processingJobs.values()).filter(job => job.status === 'processing')
  
  return NextResponse.json({
    success: true,
    status: 'Viral Clip Processing API Ready',
    activeJobs: activeJobs.length,
    features: [
      'YouTube/podcast URL processing',
      'AI-powered viral moment detection',
      'Multi-format background video integration',
      'Real-time progress tracking',
      'Rate limiting and error handling'
    ],
    backgroundTypes: [
      'minecraft - Minecraft Parkour gameplay',
      'subway_surfers - Subway Surfers gameplay', 
      'satisfying - Satisfying/oddly satisfying videos',
      'cooking - Cooking/food preparation',
      'nature - Nature scenes and landscapes'
    ]
  })
}

