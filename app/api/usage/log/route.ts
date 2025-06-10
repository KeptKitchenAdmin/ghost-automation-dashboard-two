// API route to log usage data to R2 storage ONLY
// NO EXTERNAL API CALLS - only R2 storage operations

import { NextRequest, NextResponse } from 'next/server'
import { R2Storage } from '../../../../lib/usage/r2-storage'

export const runtime = 'edge'

interface UsageEntry {
  timestamp: string;
  service: string;
  operation: string;
  tokens?: number;
  characters?: number;
  requests: number;
  cost: number;
  model?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { date, entry } = await request.json() as { date: string; entry: UsageEntry };

    if (!date || !entry) {
      return NextResponse.json({
        success: false,
        error: 'Missing date or entry data'
      }, { status: 400 });
    }

    // Get existing daily usage from R2 ONLY
    const existingData = await R2Storage.getDailyUsage(date);
    
    // Add new entry
    existingData.entries.push(entry);
    
    // Update totals
    const service = entry.service;
    if (!existingData.totals[service]) {
      existingData.totals[service] = { requests: 0, cost: 0 };
      if (entry.tokens) existingData.totals[service].tokens = 0;
      if (entry.characters) existingData.totals[service].characters = 0;
    }
    
    existingData.totals[service].requests += entry.requests;
    existingData.totals[service].cost += entry.cost;
    if (entry.tokens) {
      existingData.totals[service].tokens = (existingData.totals[service].tokens || 0) + entry.tokens;
    }
    if (entry.characters) {
      existingData.totals[service].characters = (existingData.totals[service].characters || 0) + entry.characters;
    }

    // Store back to R2 ONLY
    await R2Storage.storeDailyUsage(date, existingData);

    return NextResponse.json({
      success: true,
      message: 'Usage logged to R2 storage',
      date,
      service: entry.service,
      cost: entry.cost,
      operation: entry.operation
    });

  } catch (error) {
    console.error('Error logging usage to R2:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to log usage to R2 storage'
    }, { status: 500 });
  }
}