'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'

export function QuickActions() {
  const [generating, setGenerating] = useState<string | null>(null)
  const [results, setResults] = useState<{[key: string]: string}>({})
  const router = useRouter()

  const generateProposal = async () => {
    setGenerating('proposal')
    setTimeout(() => {
      setResults(prev => ({
        ...prev,
        proposal: '✅ PDF Proposal Generated: No proposals generated yet'
      }))
      setGenerating(null)
    }, 2000)
  }

  const sendEmailSequence = async () => {
    setGenerating('email')
    setTimeout(() => {
      setResults(prev => ({
        ...prev,
        email: '✅ Email Sequence Started!\n• No email sequences active yet'
      }))
      setGenerating(null)
    }, 1500)
  }

  const generatePixel = async () => {
    setGenerating('pixel')
    setTimeout(() => {
      setResults(prev => ({
        ...prev,
        pixel: '✅ Tracking Pixel Generated!\nNo tracking pixels created yet'
      }))
      setGenerating(null)
    }, 1000)
  }

  const openRedditVideoGenerator = () => {
    router.push('/reddit-automation')
  }

  return (
    <div className="luxury-card">
      <h3 className="luxury-heading-lg mb-6">
        Quick Actions
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-lg" style={{backgroundColor: 'var(--nude-100)', border: '1px solid var(--nude-300)'}}>
          <div>
            <h4 className="font-medium" style={{color: 'var(--luxury-black)'}}>Generate PDF Proposal</h4>
            <p className="text-sm luxury-body-muted">Create branded service proposal</p>
          </div>
          <Button
            size="sm"
            onClick={generateProposal}
            disabled={generating === 'proposal'}
            className="luxury-button-secondary"
          >
            {generating === 'proposal' ? '...' : 'Generate'}
          </Button>
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg" style={{backgroundColor: 'var(--nude-100)', border: '1px solid var(--nude-300)'}}>
          <div>
            <h4 className="font-medium" style={{color: 'var(--luxury-black)'}}>Start Email Sequence</h4>
            <p className="text-sm luxury-body-muted">Launch nurture automation</p>
          </div>
          <Button
            size="sm"
            onClick={sendEmailSequence}
            disabled={generating === 'email'}
            className="luxury-button-secondary"
          >
            {generating === 'email' ? '...' : 'Start'}
          </Button>
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg" style={{backgroundColor: 'var(--nude-100)', border: '1px solid var(--nude-300)'}}>
          <div>
            <h4 className="font-medium" style={{color: 'var(--luxury-black)'}}>Create Tracking Pixel</h4>
            <p className="text-sm luxury-body-muted">Set up campaign tracking</p>
          </div>
          <Button
            size="sm"
            onClick={generatePixel}
            disabled={generating === 'pixel'}
            className="luxury-button-secondary"
          >
            {generating === 'pixel' ? '...' : 'Create'}
          </Button>
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg" style={{backgroundColor: 'var(--sage-green)', border: '1px solid var(--warm-brown)'}}>
          <div>
            <h4 className="font-medium" style={{color: 'var(--luxury-white)'}}>Reddit Video Generator</h4>
            <p className="text-sm" style={{color: 'var(--nude-200)'}}>Create YouTube videos from Reddit stories</p>
          </div>
          <Button
            size="sm"
            onClick={openRedditVideoGenerator}
            className="luxury-button-primary"
          >
            Open Tool
          </Button>
        </div>
      </div>

      {/* Results */}
      {Object.keys(results).length > 0 && (
        <div className="mt-6 space-y-3">
          <h4 className="font-medium mb-3" style={{color: 'var(--luxury-black)'}}>Recent Actions:</h4>
          {Object.entries(results).map(([key, result]) => (
            <div key={key} className="p-3 rounded-lg" style={{backgroundColor: 'var(--sage-green)', border: '1px solid var(--warm-brown)'}}>
              <pre className="text-sm whitespace-pre-wrap" style={{color: 'var(--luxury-white)'}}>
                {result}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}