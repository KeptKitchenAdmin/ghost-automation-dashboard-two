'use client'

import { useState } from 'react'
import { CheckCircle, Play, Video, Users, Sparkles, Volume2 } from 'lucide-react'

interface Hook {
  id: string
  text: string
  category: 'curiosity' | 'urgency' | 'emotional' | 'authority'
  viralScore: number
  estimatedViews: string
}

interface HookSelectorProps {
  hooks: Hook[]
  selectedHook: string | null
  onHookSelect: (hook: Hook) => void
  onGenerateVideo: (videoType: 'heygen_avatar' | 'image_montage') => void
  isGenerating: boolean
}

export function HookSelector({ 
  hooks, 
  selectedHook, 
  onHookSelect, 
  onGenerateVideo, 
  isGenerating 
}: HookSelectorProps) {
  const [videoType, setVideoType] = useState<'heygen_avatar' | 'image_montage'>('heygen_avatar')

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'curiosity': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'urgency': return 'bg-red-100 text-red-800 border-red-300'
      case 'emotional': return 'bg-purple-100 text-purple-800 border-purple-300'
      case 'authority': return 'bg-green-100 text-green-800 border-green-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getViralScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 font-bold'
    if (score >= 75) return 'text-blue-600 font-semibold'
    if (score >= 60) return 'text-yellow-600'
    return 'text-gray-600'
  }

  return (
    <div className="space-y-6">
      {/* Hook Selection */}
      <div>
        <h3 className="text-lg font-semibold mb-4" style={{color: 'var(--luxury-black)'}}>
          🎯 Choose Your Hook (A/B Test Options)
        </h3>
        
        <div className="grid gap-4">
          {hooks.map((hook) => (
            <div
              key={hook.id}
              onClick={() => onHookSelect(hook)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                selectedHook === hook.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded text-xs border ${getCategoryColor(hook.category)}`}>
                      {hook.category.toUpperCase()}
                    </span>
                    <span className={`text-sm ${getViralScoreColor(hook.viralScore)}`}>
                      🔥 {hook.viralScore}% viral score
                    </span>
                    <span className="text-xs text-gray-500">
                      📈 ~{hook.estimatedViews} views
                    </span>
                  </div>
                  
                  <p className="text-gray-800 font-medium leading-relaxed">
                    "{hook.text}"
                  </p>
                </div>
                
                {selectedHook === hook.id && (
                  <CheckCircle className="w-6 h-6 text-blue-500 ml-3 flex-shrink-0" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Type Selection */}
      {selectedHook && (
        <div>
          <h3 className="text-lg font-semibold mb-4" style={{color: 'var(--luxury-black)'}}>
            🎬 Video Generation Options
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {/* Option A: HeyGen Avatar */}
            <div
              onClick={() => setVideoType('heygen_avatar')}
              className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                videoType === 'heygen_avatar'
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Option A: HeyGen Avatar</h4>
                  <p className="text-sm text-gray-600">Professional AI presenter</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  <span>Human-like AI avatar</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Professional background</span>
                </div>
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4" />
                  <span>Natural voice synthesis</span>
                </div>
              </div>
              
              <div className="mt-3 text-xs text-gray-500">
                ⚡ Generation time: ~30 seconds
              </div>
            </div>

            {/* Option B: Image Montage */}
            <div
              onClick={() => setVideoType('image_montage')}
              className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                videoType === 'image_montage'
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Option B: Image Montage</h4>
                  <p className="text-sm text-gray-600">Dynamic visuals + ElevenLabs voice</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  <span>AI-generated images</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Dynamic transitions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4" />
                  <span>ElevenLabs premium voice</span>
                </div>
              </div>
              
              <div className="mt-3 text-xs text-gray-500">
                ⚡ Generation time: ~45 seconds
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={() => onGenerateVideo(videoType)}
            disabled={isGenerating}
            className={`w-full py-4 px-6 rounded-lg font-semibold transition-all duration-200 ${
              isGenerating
                ? 'bg-gray-400 cursor-not-allowed'
                : videoType === 'heygen_avatar'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                : 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700'
            } text-white shadow-lg`}
          >
            {isGenerating ? (
              <div className="flex items-center justify-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Generating Secure Video...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <Play className="w-5 h-5" />
                <span>
                  Generate {videoType === 'heygen_avatar' ? 'HeyGen Avatar' : 'Image Montage'} Video
                </span>
                <span className="text-xs opacity-75">(Secure R2 Storage)</span>
              </div>
            )}
          </button>
        </div>
      )}

      {/* Security Notice */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-green-800">
          <CheckCircle className="w-5 h-5" />
          <span className="font-semibold">Enterprise Security Enabled</span>
        </div>
        <p className="text-sm text-green-700 mt-1">
          All videos are generated with secure API proxies and stored in Cloudflare R2 with 1-hour expiring URLs
        </p>
      </div>
    </div>
  )
}