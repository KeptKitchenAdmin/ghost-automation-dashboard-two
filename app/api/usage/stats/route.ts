// API route to get usage statistics from R2 storage ONLY
// NO EXTERNAL API CALLS - reads only from R2 storage

import { NextRequest, NextResponse } from 'next/server'
import { R2Storage } from '../../../../lib/usage/r2-storage'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const today = new Date().toISOString().split('T')[0];
    const thisMonth = new Date().toISOString().substring(0, 7);

    // Get daily usage from R2 ONLY
    const dailyUsage = await R2Storage.getDailyUsage(today);
    
    // Get monthly usage from R2 ONLY (aggregated from daily files)
    const monthlyUsage = await R2Storage.getMonthlyUsage(thisMonth);

    // Format for dashboard display
    const stats = {
      daily: formatServiceStats(dailyUsage.totals),
      monthly: formatServiceStats(monthlyUsage),
      summary: {
        dailyTotal: Object.values(dailyUsage.totals).reduce((sum: number, service: any) => sum + (service.cost || 0), 0),
        monthlyTotal: Object.values(monthlyUsage).reduce((sum: number, service: any) => sum + (service.cost || 0), 0),
        lastUpdated: dailyUsage.lastUpdated || new Date().toISOString()
      }
    };

    return NextResponse.json({
      success: true,
      stats,
      source: 'R2 storage only',
      note: 'No external API calls made'
    });

  } catch (error) {
    console.error('Error fetching usage stats from R2:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch usage stats from R2',
      stats: createEmptyStats()
    }, { status: 500 });
  }
}

function formatServiceStats(totals: Record<string, any>) {
  return {
    openai: {
      tokens: totals.openai?.tokens || 0,
      requests: totals.openai?.requests || 0,
      cost: totals.openai?.cost || 0
    },
    anthropic: {
      tokens: totals.anthropic?.tokens || 0,
      requests: totals.anthropic?.requests || 0,
      cost: totals.anthropic?.cost || 0
    },
    elevenlabs: {
      characters: totals.elevenlabs?.characters || 0,
      requests: totals.elevenlabs?.requests || 0,
      cost: totals.elevenlabs?.cost || 0
    },
    heygen: {
      requests: totals.heygen?.requests || 0,
      cost: totals.heygen?.cost || 0
    },
    googleCloud: {
      requests: totals.googleCloud?.requests || 0,
      cost: totals.googleCloud?.cost || 0
    }
  };
}

function createEmptyStats() {
  return {
    daily: formatServiceStats({}),
    monthly: formatServiceStats({}),
    summary: {
      dailyTotal: 0,
      monthlyTotal: 0,
      lastUpdated: new Date().toISOString()
    }
  };
}