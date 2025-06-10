
import { NextRequest, NextResponse } from 'next/server'

interface FactCheckRequest {
  content: string
  contentType: string
  claims: string[]
}

interface FactCheckResponse {
  success: boolean
  overallScore: number
  factChecks: Array<{
    claim: string
    status: 'verified' | 'questionable' | 'false' | 'needs_citation'
    confidence: number
    explanation: string
    sources?: string[]
  }>
  recommendations: string[]
  safeToPublish: boolean
}

// Fact-checking using OpenAI GPT-4 (most reliable for fact verification)
async function factCheckWithOpenAI(content: string, claims: string[]): Promise<any> {
  const openaiApiKey = process.env.OPENAI_API_KEY
  
  if (!openaiApiKey) {
    throw new Error('OpenAI API key required for fact checking')
  }

  const prompt = `You are a professional fact-checker. Analyze the following content and specific claims for factual accuracy.

CONTENT TO FACT-CHECK:
${content}

SPECIFIC CLAIMS TO VERIFY:
${claims.map((claim, i) => `${i + 1}. ${claim}`).join('\n')}

For each claim, provide:
1. Status: verified/questionable/false/needs_citation
2. Confidence level: 0-100%
3. Explanation of why it's accurate/inaccurate
4. What sources would verify this claim

CRITICAL INSTRUCTIONS:
- Be extremely strict about factual accuracy
- Mark anything unverifiable as "needs_citation"
- Flag exaggerated or misleading claims as "questionable"
- Only mark claims as "verified" if they're demonstrably true
- Consider the context (educational content vs entertainment)
- Check for logical fallacies or misleading implications

Respond in JSON format:
{
  "overallScore": number (0-100),
  "factChecks": [
    {
      "claim": "exact claim text",
      "status": "verified/questionable/false/needs_citation",
      "confidence": number (0-100),
      "explanation": "detailed explanation",
      "suggestedSources": ["source1", "source2"]
    }
  ],
  "recommendations": ["how to improve accuracy"],
  "safeToPublish": boolean
}`

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a professional fact-checker with expertise in verifying claims across multiple domains. You prioritize accuracy over engagement and flag any potentially misleading information.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1, // Low temperature for consistency
        max_tokens: 2000
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    const factCheckResult = JSON.parse(data.choices[0].message.content)
    
    return factCheckResult
  } catch (error) {
    console.error('OpenAI fact-check failed:', error)
    throw error
  }
}

// Extract factual claims from content
function extractClaims(content: string): string[] {
  const claims: string[] = []
  
  // Extract numerical claims
  const numberPattern = /(\d+(?:,\d+)*(?:\.\d+)?)\s*(percent|%|million|billion|thousand|years?|dollars?|\$)/gi
  const numberMatches = content.match(numberPattern)
  if (numberMatches) {
    numberMatches.forEach(match => {
      // Find the sentence containing this number
      const sentences = content.split(/[.!?]/)
      const claimSentence = sentences.find(sentence => sentence.includes(match))
      if (claimSentence && claimSentence.trim().length > 10) {
        claims.push(claimSentence.trim())
      }
    })
  }
  
  // Extract specific factual statements
  const factualPatterns = [
    /The .+ industry .+/gi,
    /Scientists .+/gi,
    /Research shows .+/gi,
    /Studies found .+/gi,
    /Experts say .+/gi,
    /According to .+/gi,
    /Data reveals .+/gi,
    /Harvard .+/gi,
    /Government .+/gi,
    /Billionaires .+/gi,
    /Millionaires .+/gi
  ]
  
  factualPatterns.forEach(pattern => {
    const matches = content.match(pattern)
    if (matches) {
      matches.forEach(match => {
        const sentences = content.split(/[.!?]/)
        const claimSentence = sentences.find(sentence => sentence.includes(match))
        if (claimSentence && claimSentence.trim().length > 15) {
          claims.push(claimSentence.trim())
        }
      })
    }
  })
  
  // Remove duplicates and filter out very short claims
  return Array.from(new Set(claims)).filter(claim => claim.length > 20)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, contentType } = body
    
    if (!content) {
      return NextResponse.json({
        success: false,
        error: 'Content is required for fact-checking'
      }, { status: 400 })
    }
    
    console.log('🔍 Fact-checking content...')
    
    // Extract factual claims from content
    const claims = extractClaims(content)
    
    if (claims.length === 0) {
      return NextResponse.json({
        success: true,
        overallScore: 95,
        factChecks: [],
        recommendations: ['No specific factual claims detected. Content appears to be opinion-based.'],
        safeToPublish: true,
        message: 'No factual claims found to verify'
      })
    }
    
    console.log(`📋 Found ${claims.length} claims to fact-check:`, claims)
    
    // Fact-check with OpenAI GPT-4
    const factCheckResult = await factCheckWithOpenAI(content, claims)
    
    // Add safety recommendations
    const safetyRecommendations = []
    
    if (factCheckResult.overallScore < 70) {
      safetyRecommendations.push('⚠️ Multiple accuracy issues detected - consider revising content')
    }
    
    if (factCheckResult.factChecks.some((check: any) => check.status === 'false')) {
      safetyRecommendations.push('❌ False claims detected - must be corrected before publishing')
    }
    
    if (factCheckResult.factChecks.some((check: any) => check.status === 'needs_citation')) {
      safetyRecommendations.push('📚 Claims need citations - add sources or disclaimer')
    }
    
    const response: FactCheckResponse = {
      success: true,
      overallScore: factCheckResult.overallScore,
      factChecks: factCheckResult.factChecks,
      recommendations: [...factCheckResult.recommendations, ...safetyRecommendations],
      safeToPublish: factCheckResult.safeToPublish && factCheckResult.overallScore >= 70
    }
    
    console.log(`✅ Fact-check complete. Score: ${response.overallScore}/100`)
    
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('Fact-checking failed:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Fact-checking service temporarily unavailable',
      overallScore: 50,
      factChecks: [],
      recommendations: ['⚠️ Fact-checking failed - manual verification recommended'],
      safeToPublish: false
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    status: 'Fact-Checking API Ready',
    features: [
      'OpenAI GPT-4 fact verification',
      'Automatic claim extraction',
      'Confidence scoring',
      'Source recommendations',
      'Publication safety checks'
    ],
    guidelines: {
      'verified': 'Claims backed by reliable sources',
      'questionable': 'Claims that may be misleading or exaggerated',
      'false': 'Claims that are demonstrably incorrect',
      'needs_citation': 'Claims that require source attribution'
    }
  })
}