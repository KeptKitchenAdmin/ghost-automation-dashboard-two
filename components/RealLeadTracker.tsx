'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Users, MessageSquare, DollarSign, Calendar } from 'lucide-react'

interface Lead {
  id: string
  source: 'tiktok' | 'instagram' | 'direct'
  type: 'affiliate' | 'service'
  comment: string
  username: string
  timestamp: Date
  status: 'new' | 'contacted' | 'qualified' | 'proposal-sent' | 'closed' | 'lost'
  value?: number
  followUpDate?: Date
}

export function RealLeadTracker() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [newLead, setNewLead] = useState<{
    username: string
    comment: string
    source: 'tiktok' | 'instagram' | 'direct'
    type: 'affiliate' | 'service'
  }>({
    username: '',
    comment: '',
    source: 'tiktok',
    type: 'service'
  })
  const [connecting, setConnecting] = useState(false)

  // Initialize with empty leads array
  useEffect(() => {
    const mockLeads: Lead[] = []
    setLeads(mockLeads)
  }, [])

  const addManualLead = () => {
    if (!newLead.username || !newLead.comment) return

    const lead: Lead = {
      id: Date.now().toString(),
      source: newLead.source,
      type: newLead.type,
      comment: newLead.comment,
      username: newLead.username,
      timestamp: new Date(),
      status: 'new'
    }

    setLeads(prev => [lead, ...prev])
    setNewLead({ username: '', comment: '', source: 'tiktok', type: 'service' })
  }

  const updateLeadStatus = (leadId: string, status: Lead['status'], value?: number) => {
    setLeads(prev => prev.map(lead => 
      lead.id === leadId 
        ? { ...lead, status, value: value || lead.value }
        : lead
    ))
  }

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'new': return 'text-blue-400'
      case 'contacted': return 'text-yellow-400'
      case 'qualified': return 'text-purple-400'
      case 'proposal-sent': return 'text-orange-400'
      case 'closed': return 'text-green-400'
      case 'lost': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const generateResponse = (lead: Lead) => {
    if (lead.type === 'service') {
      return `Hi ${lead.username}! Thanks for your interest in automation systems. I'd love to learn more about your business and see how I can help. Could you tell me:

1. What's your biggest manual process right now?
2. How many hours per week does it take?
3. What's your current monthly revenue?

I typically build custom systems ranging from $5K-$25K depending on complexity. Would you be open to a quick 15-min call this week?`
    } else {
      return `Hey ${lead.username}! The tool I mentioned is [PRODUCT NAME] - I've been using it for 6 months and it's genuinely saved me hours every week. Here's the link: [AFFILIATE LINK]

Let me know if you have any questions about it!`
    }
  }

  const connectTikTok = async () => {
    setConnecting(true)
    // Simulate API connection
    setTimeout(() => {
      setConnecting(false)
      alert('TikTok integration would connect here. This would use TikTok Business API to automatically capture comments with keywords like "SYSTEM", "AI", etc.')
    }, 2000)
  }

  return (
    <div className="professional-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">
          🎯 Real Lead Tracker
        </h3>
        <Button 
          onClick={connectTikTok}
          disabled={connecting}
          className="secondary-button"
        >
          {connecting ? 'Connecting...' : 'Connect TikTok API'}
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-dark-700/30 rounded-lg p-3 text-center">
          <Users className="w-5 h-5 text-blue-400 mx-auto mb-1" />
          <div className="text-lg font-semibold text-white">{leads.length}</div>
          <div className="text-xs text-gray-400">Total Leads</div>
        </div>
        <div className="bg-dark-700/30 rounded-lg p-3 text-center">
          <MessageSquare className="w-5 h-5 text-green-400 mx-auto mb-1" />
          <div className="text-lg font-semibold text-white">
            {leads.filter(l => l.status === 'qualified').length}
          </div>
          <div className="text-xs text-gray-400">Qualified</div>
        </div>
        <div className="bg-dark-700/30 rounded-lg p-3 text-center">
          <DollarSign className="w-5 h-5 text-primary-500 mx-auto mb-1" />
          <div className="text-lg font-semibold text-white">
            ${leads.filter(l => l.status === 'closed').reduce((sum, l) => sum + (l.value || 0), 0).toLocaleString()}
          </div>
          <div className="text-xs text-gray-400">Closed Revenue</div>
        </div>
        <div className="bg-dark-700/30 rounded-lg p-3 text-center">
          <Calendar className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
          <div className="text-lg font-semibold text-white">
            {leads.filter(l => l.status === 'proposal-sent').length}
          </div>
          <div className="text-xs text-gray-400">Pending</div>
        </div>
      </div>

      {/* Add Lead Manually */}
      <div className="bg-dark-700/30 rounded-lg p-4 mb-6">
        <h4 className="text-white font-medium mb-3">Add Lead Manually</h4>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <input
            type="text"
            value={newLead.username}
            onChange={(e) => setNewLead(prev => ({...prev, username: e.target.value}))}
            placeholder="@username"
            className="professional-input"
          />
          <select
            value={newLead.type}
            onChange={(e) => setNewLead(prev => ({...prev, type: e.target.value as 'service' | 'affiliate'}))}
            className="professional-input"
          >
            <option value="service">Service Lead</option>
            <option value="affiliate">Affiliate Lead</option>
          </select>
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            value={newLead.comment}
            onChange={(e) => setNewLead(prev => ({...prev, comment: e.target.value}))}
            placeholder="Their comment or message"
            className="professional-input flex-1"
          />
          <Button onClick={addManualLead} className="primary-button">
            Add Lead
          </Button>
        </div>
      </div>

      {/* Leads List */}
      <div className="space-y-3">
        <h4 className="text-white font-medium">Recent Leads</h4>
        {leads.slice(0, 5).map(lead => (
          <div key={lead.id} className="bg-dark-700/30 rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">{lead.username}</span>
                  <span className="text-xs bg-primary-500/20 text-primary-400 px-2 py-1 rounded">
                    {lead.type}
                  </span>
                  <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                    {lead.source}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mt-1">"{lead.comment}"</p>
                <p className="text-gray-500 text-xs mt-1">
                  {lead.timestamp.toLocaleDateString()} at {lead.timestamp.toLocaleTimeString()}
                </p>
              </div>
              <select
                value={lead.status}
                onChange={(e) => updateLeadStatus(lead.id, e.target.value as Lead['status'])}
                className={`text-xs px-2 py-1 rounded bg-dark-800 border border-gray-600 ${getStatusColor(lead.status)}`}
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="proposal-sent">Proposal Sent</option>
                <option value="closed">Closed</option>
                <option value="lost">Lost</option>
              </select>
            </div>
            
            {lead.status === 'new' && (
              <div className="mt-3 bg-dark-800/50 rounded p-3">
                <div className="text-xs text-gray-400 mb-2">Suggested Response:</div>
                <div className="text-xs text-gray-300 whitespace-pre-wrap">
                  {generateResponse(lead)}
                </div>
                <Button 
                  size="sm" 
                  className="mt-2 primary-button"
                  onClick={() => updateLeadStatus(lead.id, 'contacted')}
                >
                  Mark as Contacted
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}