// Shared job storage for viral clip processing
interface ProcessingJob {
  jobId: string
  status: 'processing' | 'completed' | 'failed'
  progress: number
  currentStep: string
  sourceUrl: string
  options: any
  generatedClips: any[]
  error?: string
  startTime: number
  endTime?: number
}

// In-memory job storage (in production, use Redis or database)
export const processingJobs = new Map<string, ProcessingJob>()

export type { ProcessingJob }