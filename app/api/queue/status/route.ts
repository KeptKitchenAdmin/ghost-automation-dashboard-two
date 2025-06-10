
import { NextRequest, NextResponse } from 'next/server'

interface QueueItem {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  created_at: string
  updated_at: string
  product_category: string
  target_audience: string
  progress?: number
}

interface QueueResponse {
  status: string
  queue: {
    total_items: number
    pending: number
    processing: number
    completed: number
    failed: number
    items: QueueItem[]
  }
}

export async function GET(request: NextRequest) {
  try {
    // Mock queue data (converted from Python PreviewQueue)
    const mockQueueItems: QueueItem[] = [
      {
        id: 'video-001',
        status: 'completed',
        created_at: new Date(Date.now() - 3600000).toISOString(),
        updated_at: new Date(Date.now() - 1800000).toISOString(),
        product_category: 'fitness',
        target_audience: 'gym enthusiasts',
        progress: 100
      },
      {
        id: 'video-002',
        status: 'processing',
        created_at: new Date(Date.now() - 1800000).toISOString(),
        updated_at: new Date(Date.now() - 300000).toISOString(),
        product_category: 'tech',
        target_audience: 'early adopters',
        progress: 65
      },
      {
        id: 'video-003',
        status: 'pending',
        created_at: new Date(Date.now() - 900000).toISOString(),
        updated_at: new Date(Date.now() - 900000).toISOString(),
        product_category: 'beauty',
        target_audience: 'millennials'
      }
    ]
    
    // Calculate queue statistics
    const queueStats = {
      total_items: mockQueueItems.length,
      pending: mockQueueItems.filter(item => item.status === 'pending').length,
      processing: mockQueueItems.filter(item => item.status === 'processing').length,
      completed: mockQueueItems.filter(item => item.status === 'completed').length,
      failed: mockQueueItems.filter(item => item.status === 'failed').length,
      items: mockQueueItems
    }
    
    const response: QueueResponse = {
      status: 'success',
      queue: queueStats
    }
    
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('Queue status error:', error)
    
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
      queue: {
        total_items: 0,
        pending: 0,
        processing: 0,
        completed: 0,
        failed: 0,
        items: []
      }
    }, { status: 500 })
  }
}