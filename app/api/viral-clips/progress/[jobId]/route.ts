export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server'
import { processingJobs } from '../../shared/jobStore'

export async function GET(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const { jobId } = params
    
    if (!jobId) {
      return NextResponse.json(
        { success: false, error: 'Job ID is required' },
        { status: 400 }
      )
    }
    
    const job = processingJobs.get(jobId)
    
    if (!job) {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      )
    }
    
    // Calculate processing time
    const processingTime = job.endTime ? job.endTime - job.startTime : Date.now() - job.startTime
    const processingTimeMinutes = Math.floor(processingTime / 60000)
    const processingTimeSeconds = Math.floor((processingTime % 60000) / 1000)
    
    const response: any = {
      success: true,
      jobId: job.jobId,
      status: job.status,
      progress: job.progress,
      currentStep: job.currentStep,
      sourceUrl: job.sourceUrl,
      generatedClips: job.generatedClips,
      processingTime: {
        total: processingTime,
        formatted: `${processingTimeMinutes}:${processingTimeSeconds.toString().padStart(2, '0')}`
      },
      options: {
        numberOfClips: job.options.numberOfClips,
        clipDuration: job.options.clipDuration,
        backgroundType: job.options.backgroundType
      }
    }
    
    // Add completion data if job is done
    if (job.status === 'completed') {
      response.finalClips = job.generatedClips
      response.completedAt = job.endTime ? new Date(job.endTime).toISOString() : new Date().toISOString()
    }
    
    // Add error info if job failed
    if (job.status === 'failed') {
      response.error = job.error || 'Unknown error occurred'
      response.failedAt = job.endTime ? new Date(job.endTime).toISOString() : new Date().toISOString()
    }
    
    console.log(`📊 Progress check for job ${jobId}: ${job.progress}% - ${job.status}`)
    
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('❌ Error getting job progress:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get job progress',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Allow CORS for real-time polling
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}