// Free Plan Limits Configuration
// Real limits from your actual API accounts

export const FREE_PLAN_LIMITS = {
  openai: {
    monthlyBudget: 20.00, // $20/month budget
    currentUsed: 0.01,    // Currently used $0.01
    estimatedClipsCapacity: 4000, // Can handle 4,000-20,000 clips
    costPerToken: 0.000015, // Average GPT-4 cost
    warningThreshold: 15.00, // 75% of budget
    criticalThreshold: 18.00, // 90% of budget
  },
  
  elevenlabs: {
    monthlyCredits: 10000, // 10,000 credits/month
    currentUsed: 0,
    estimatedClipsCapacity: 65, // Can handle ~65-130 clips
    creditsPerClip: 150, // Average credits per clip
    warningThreshold: 7500, // 75% of credits
    criticalThreshold: 9000, // 90% of credits
  },
  
  heygen: {
    monthlyCredits: 10, // 10 credits/month - MAIN BOTTLENECK
    currentUsed: 0,
    estimatedClipsCapacity: 20, // Can handle ~20 clips
    creditsPerClip: 0.5, // Average credits per clip
    warningThreshold: 7, // 70% of credits
    criticalThreshold: 9, // 90% of credits
    isBottleneck: true, // This service limits total capacity
  },
  
  googleCloud: {
    totalCredit: 300.00, // $300 credit
    daysRemaining: 88,
    currentUsed: 0,
    estimatedClipsCapacity: 25000, // Can handle 25,000+ clips
    costPerRequest: 0.012, // Average cost per request
    warningThreshold: 225.00, // 75% of credit
    criticalThreshold: 270.00, // 90% of credit
  }
}

export const SYSTEM_CAPACITY = {
  monthlyClipLimit: 20, // Limited by HeyGen's 10 credits
  bottleneckService: 'heygen',
  recommendedDailyLimit: 1, // ~20 clips / 30 days
  safetyBuffer: 2, // Keep 2 credits as buffer
}

export function getServiceStatus(service: keyof typeof FREE_PLAN_LIMITS, currentUsage: number) {
  const limits = FREE_PLAN_LIMITS[service]
  const usagePercentage = (currentUsage / (limits.monthlyBudget || limits.monthlyCredits || limits.totalCredit)) * 100
  
  if (usagePercentage >= 90) return 'critical'
  if (usagePercentage >= 75) return 'warning'
  return 'ok'
}

export function getRemainingCapacity() {
  return {
    heygenCredits: FREE_PLAN_LIMITS.heygen.monthlyCredits - FREE_PLAN_LIMITS.heygen.currentUsed,
    estimatedClipsRemaining: Math.floor((FREE_PLAN_LIMITS.heygen.monthlyCredits - FREE_PLAN_LIMITS.heygen.currentUsed) / FREE_PLAN_LIMITS.heygen.creditsPerClip),
    daysUntilReset: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() - new Date().getDate(),
  }
}