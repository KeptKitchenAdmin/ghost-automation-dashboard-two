'use client'

import { useState } from 'react'
import { Shield, AlertTriangle, CheckCircle, Clock, Eye, TrendingUp, Users, Zap } from 'lucide-react'

interface Product {
  name: string
  category: string
  benefits: string[]
  claims?: string[]
}

interface ShadowbanSafeContent {
  script: string
  hashtags: string[]
  video_config: {
    length: number
    voice_speed: number
    background_music: string
    text_placement: string
    transition_style: string
  }
  ai_disclosure: {
    text: string
    placement: string
    duration: number
  }
  safety_score: number
  compliance_check: {
    is_compliant: boolean
    issues: string[]
    recommendations: string[]
  }
}

interface PostingGuidance {
  can_post: boolean
  recommended_time?: string
  spacing_advice: string
}

export function ShadowbanSafeGenerator() {
  const [products, setProducts] = useState<Product[]>([{
    name: '',
    category: '',
    benefits: [''],
    claims: ['']
  }])
  const [contentType, setContentType] = useState<'educational' | 'lifestyle' | 'supplement_education'>('educational')
  const [safetyLevel, setSafetyLevel] = useState<'high' | 'maximum'>('maximum')
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState<{
    content: ShadowbanSafeContent
    posting_guidance: PostingGuidance
    shadowban_prevention: any
  } | null>(null)

  const addProduct = () => {
    if (products.length < 3) { // Enforce safety limit
      setProducts([...products, {
        name: '',
        category: '',
        benefits: [''],
        claims: ['']
      }])
    }
  }

  const updateProduct = (index: number, field: keyof Product, value: any) => {
    const updated = [...products]
    updated[index] = { ...updated[index], [field]: value }
    setProducts(updated)
  }

  const updateProductArray = (index: number, field: 'benefits' | 'claims', arrayIndex: number, value: string) => {
    const updated = [...products]
    const currentArray = [...(updated[index][field] || [])]
    currentArray[arrayIndex] = value
    updated[index] = { ...updated[index], [field]: currentArray }
    setProducts(updated)
  }

  const addArrayItem = (index: number, field: 'benefits' | 'claims') => {
    const updated = [...products]
    const currentArray = [...(updated[index][field] || [])]
    currentArray.push('')
    updated[index] = { ...updated[index], [field]: currentArray }
    setProducts(updated)
  }

  const generateShadowbanSafeContent = async () => {
    setGenerating(true)
    setResult(null)

    try {
      const response = await fetch('/api/content/shadowban-safe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          products: products.filter(p => p.name.trim() !== ''),
          contentType,
          safetyLevel,
          includeDisclaimer: true
        })
      })

      const data = await response.json()

      if (data.success) {
        setResult(data)
      } else {
        alert(`Generation failed: ${data.error}`)
      }
    } catch (error) {
      console.error('Generation failed:', error)
      alert('Generation failed. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  const getSafetyScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getSafetyScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent Safety'
    if (score >= 80) return 'Good Safety'
    if (score >= 70) return 'Moderate Risk'
    return 'High Risk'
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-8 h-8 text-green-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">TikTok Shadowban-Safe Content Generator</h1>
            <p className="text-gray-600">Generate compliant content with anti-shadowban protection</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle className="w-4 h-4" />
            <span>Community Guidelines Compliant</span>
          </div>
          <div className="flex items-center gap-2 text-blue-700">
            <Eye className="w-4 h-4" />
            <span>Pattern Detection Prevention</span>
          </div>
          <div className="flex items-center gap-2 text-purple-700">
            <TrendingUp className="w-4 h-4" />
            <span>Long-term Account Growth</span>
          </div>
        </div>
      </div>

      {/* Configuration */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Safety Configuration</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="educational">Educational Health Content</option>
              <option value="lifestyle">Lifestyle & Wellness</option>
              <option value="supplement_education">Supplement Education</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Safety Level</label>
            <select
              value={safetyLevel}
              onChange={(e) => setSafetyLevel(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="high">High Safety</option>
              <option value="maximum">Maximum Safety (Recommended)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Input */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Products (Max 3 for Safety)</h2>
        
        {products.map((product, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Product Name"
                value={product.name}
                onChange={(e) => updateProduct(index, 'name', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <input
                type="text"
                placeholder="Category (e.g., vitamin, supplement)"
                value={product.category}
                onChange={(e) => updateProduct(index, 'category', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Safe Benefits (use 'may help', 'supports')</label>
              {(product.benefits || []).map((benefit, benefitIndex) => (
                <div key={benefitIndex} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="e.g., 'may support energy levels'"
                    value={benefit}
                    onChange={(e) => updateProductArray(index, 'benefits', benefitIndex, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                  {benefitIndex === (product.benefits?.length || 1) - 1 && (
                    <button
                      type="button"
                      onClick={() => addArrayItem(index, 'benefits')}
                      className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      +
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {products.length < 3 && (
          <button
            type="button"
            onClick={addProduct}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Add Another Product
          </button>
        )}
      </div>

      {/* Generate Button */}
      <button
        onClick={generateShadowbanSafeContent}
        disabled={generating || products.every(p => !p.name.trim())}
        className="w-full py-4 px-6 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        {generating ? (
          <div className="flex items-center justify-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Generating Shadowban-Safe Content...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-3">
            <Shield className="w-5 h-5" />
            <span>Generate Shadowban-Safe Content</span>
          </div>
        )}
      </button>

      {/* Results */}
      {result && (
        <div className="mt-8 space-y-6">
          {/* Safety Score */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Safety Analysis</h3>
              <div className={`text-2xl font-bold ${getSafetyScoreColor(result.content.safety_score)}`}>
                {result.content.safety_score}/100
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className={`text-lg font-semibold ${getSafetyScoreColor(result.content.safety_score)}`}>
                  {getSafetyScoreLabel(result.content.safety_score)}
                </div>
                <div className="text-sm text-gray-600">Content Safety</div>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className={`text-lg font-semibold ${result.content.compliance_check.is_compliant ? 'text-green-600' : 'text-red-600'}`}>
                  {result.content.compliance_check.is_compliant ? 'Compliant' : 'Issues Found'}
                </div>
                <div className="text-sm text-gray-600">TikTok Guidelines</div>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className={`text-lg font-semibold ${result.posting_guidance.can_post ? 'text-green-600' : 'text-yellow-600'}`}>
                  {result.posting_guidance.can_post ? 'Ready to Post' : 'Wait Recommended'}
                </div>
                <div className="text-sm text-gray-600">Posting Status</div>
              </div>
            </div>
            
            {result.content.compliance_check.issues.length > 0 && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-medium text-red-800 mb-2">Issues Found:</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  {result.content.compliance_check.issues.map((issue, index) => (
                    <li key={index}>• {issue}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Generated Content */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Generated Safe Content</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="font-medium mb-2">Script:</h4>
              <p className="text-gray-800 whitespace-pre-wrap">{result.content.script}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Safe Hashtags:</h4>
                <div className="flex flex-wrap gap-2">
                  {result.content.hashtags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">AI Disclosure:</h4>
                <div className="text-sm text-gray-600 bg-yellow-50 p-2 rounded">
                  <div><strong>Text:</strong> {result.content.ai_disclosure.text}</div>
                  <div><strong>Placement:</strong> {result.content.ai_disclosure.placement}</div>
                  <div><strong>Duration:</strong> {result.content.ai_disclosure.duration}s</div>
                </div>
              </div>
            </div>
          </div>

          {/* Video Configuration */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Anti-Detection Video Config</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <strong>Length:</strong> {result.content.video_config.length}s
              </div>
              <div>
                <strong>Voice Speed:</strong> {result.content.video_config.voice_speed}x
              </div>
              <div>
                <strong>Music:</strong> {result.content.video_config.background_music}
              </div>
              <div>
                <strong>Text Position:</strong> {result.content.video_config.text_placement}
              </div>
              <div>
                <strong>Transitions:</strong> {result.content.video_config.transition_style}
              </div>
            </div>
          </div>

          {/* Posting Guidance */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-800">Posting Guidance</h3>
            
            <div className="space-y-2 text-blue-700">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{result.posting_guidance.spacing_advice}</span>
              </div>
              {result.posting_guidance.recommended_time && (
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  <span>Next recommended post: {result.posting_guidance.recommended_time}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}