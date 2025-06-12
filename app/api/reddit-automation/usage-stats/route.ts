import { NextResponse } from 'next/server';
import { ClaudeService } from '../../../../lib/services/claude-service';

export async function GET() {
  try {
    console.log('📊 API: Fetching usage statistics');
    
    // Get current usage from Claude service
    const claudeUsage = ClaudeService.getCurrentUsage();
    
    // Mock Shotstack usage (in real implementation, this would come from Shotstack service)
    const shotstackUsage = {
      rendersToday: 0,
      costToday: 0,
      minutesToday: 0,
      limits: {
        MAX_CALLS: 10,
        MAX_COST: 5.00,
        MAX_MINUTES: 12.5
      },
      resetDate: new Date().toDateString()
    };
    
    const totalCostToday = claudeUsage.costToday + shotstackUsage.costToday;
    
    const usageStats = {
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
        renders: shotstackUsage.rendersToday,
        cost: shotstackUsage.costToday,
        minutes: shotstackUsage.minutesToday,
        limits: shotstackUsage.limits,
        utilization: {
          renders: `${shotstackUsage.rendersToday}/${shotstackUsage.limits.MAX_CALLS}`,
          cost: `$${shotstackUsage.costToday.toFixed(2)}/$${shotstackUsage.limits.MAX_COST.toFixed(2)}`,
          minutes: `${shotstackUsage.minutesToday.toFixed(1)}/${shotstackUsage.limits.MAX_MINUTES}min`
        }
      },
      totalCostToday,
      lastUpdated: new Date().toISOString(),
      budgetStatus: {
        claude: {
          percentUsed: (claudeUsage.costToday / claudeUsage.limits.MAX_COST) * 100,
          status: claudeUsage.costToday > claudeUsage.limits.MAX_COST * 0.8 ? 'warning' : 'normal'
        },
        shotstack: {
          percentUsed: (shotstackUsage.costToday / shotstackUsage.limits.MAX_COST) * 100,
          status: shotstackUsage.costToday > shotstackUsage.limits.MAX_COST * 0.8 ? 'warning' : 'normal'
        }
      }
    };
    
    console.log('✅ API: Usage statistics retrieved successfully');
    
    return NextResponse.json({
      success: true,
      ...usageStats
    });
    
  } catch (error) {
    console.error('❌ API: Failed to fetch usage statistics:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch usage statistics',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}