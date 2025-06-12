// Phase 6: Advanced Analytics Dashboard Component
// Real-time monitoring and performance analytics for video generation pipeline

'use client'

import React, { useState, useEffect } from 'react'
import { 
  Activity, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  AlertCircle, 
  CheckCircle,
  Zap,
  BarChart3,
  Cpu,
  Database,
  RefreshCw,
  Settings
} from 'lucide-react'

interface SystemStatus {
  status: 'healthy' | 'degraded' | 'critical'
  uptime: number
  memoryUsage: number
  cacheHitRate: number
  apiLatency: Record<string, number>
  errorRate: number
  throughput: number
}

interface PerformanceMetric {
  timestamp: number
  metric: string
  value: number
  unit: string
}

interface Alert {
  id: string
  message: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  triggered: number
}

interface PipelineStats {
  queueSize: number
  activeJobs: number
  completedToday: number
  failedToday: number
  averageProcessingTime: number
  totalCostToday: number
}

export const AdvancedAnalyticsDashboard: React.FC = () => {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    status: 'healthy',
    uptime: 0,
    memoryUsage: 0,
    cacheHitRate: 0,
    apiLatency: {},
    errorRate: 0,
    throughput: 0
  })

  const [pipelineStats, setPipelineStats] = useState<PipelineStats>({
    queueSize: 0,
    activeJobs: 0,
    completedToday: 0,
    failedToday: 0,
    averageProcessingTime: 0,
    totalCostToday: 0
  })

  const [recentMetrics, setRecentMetrics] = useState<PerformanceMetric[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedTimeRange, setSelectedTimeRange] = useState<'1h' | '6h' | '24h'>('1h')

  // Real-time monitoring - updates every 30 seconds
  useEffect(() => {
    const fetchSystemData = async () => {
      setIsRefreshing(true)
      
      try {
        // Simulate fetching system status
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Mock data - replace with real monitoring service calls
        const mockStatus: SystemStatus = {
          status: Math.random() > 0.1 ? 'healthy' : 'degraded',
          uptime: Date.now() - (Date.now() - Math.random() * 86400000),
          memoryUsage: 0.3 + Math.random() * 0.4, // 30-70%
          cacheHitRate: 0.7 + Math.random() * 0.3, // 70-100%
          apiLatency: {
            claude: 800 + Math.random() * 400,
            shotstack: 1200 + Math.random() * 800,
            elevenlabs: 600 + Math.random() * 300
          },
          errorRate: Math.random() * 0.05, // 0-5%
          throughput: Math.random() * 2 // 0-2 videos per minute
        }

        const mockPipelineStats: PipelineStats = {
          queueSize: Math.floor(Math.random() * 5),
          activeJobs: Math.floor(Math.random() * 3),
          completedToday: Math.floor(Math.random() * 20),
          failedToday: Math.floor(Math.random() * 3),
          averageProcessingTime: 45000 + Math.random() * 30000, // 45-75 seconds
          totalCostToday: Math.random() * 15 // $0-15
        }

        setSystemStatus(mockStatus)
        setPipelineStats(mockPipelineStats)

        // Generate recent metrics
        const now = Date.now()
        const metrics: PerformanceMetric[] = []
        
        for (let i = 0; i < 20; i++) {
          metrics.push({
            timestamp: now - (i * 180000), // Every 3 minutes
            metric: 'throughput',
            value: Math.random() * 2,
            unit: 'videos/min'
          })
        }
        
        setRecentMetrics(metrics.reverse())

        // Generate alerts if needed
        const newAlerts: Alert[] = []
        
        if (mockStatus.errorRate > 0.1) {
          newAlerts.push({
            id: `alert_${Date.now()}`,
            message: `High error rate detected: ${(mockStatus.errorRate * 100).toFixed(1)}%`,
            severity: 'high',
            triggered: Date.now()
          })
        }
        
        if (mockStatus.memoryUsage > 0.85) {
          newAlerts.push({
            id: `alert_${Date.now() + 1}`,
            message: `Memory usage is high: ${(mockStatus.memoryUsage * 100).toFixed(1)}%`,
            severity: 'medium',
            triggered: Date.now()
          })
        }

        setAlerts(newAlerts)

      } catch (error) {
        console.error('Failed to fetch system data:', error)
      }
      
      setIsRefreshing(false)
    }

    // Initial fetch
    fetchSystemData()
    
    // Set up interval
    const interval = setInterval(fetchSystemData, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const formatUptime = (uptime: number): string => {
    const hours = Math.floor(uptime / 3600000)
    const minutes = Math.floor((uptime % 3600000) / 60000)
    return `${hours}h ${minutes}m`
  }

  const formatLatency = (latency: number): string => {
    return `${Math.round(latency)}ms`
  }

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'healthy': return 'text-green-400'
      case 'degraded': return 'text-yellow-400'
      case 'critical': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'degraded': return <AlertCircle className="w-5 h-5 text-yellow-400" />
      case 'critical': return <AlertCircle className="w-5 h-5 text-red-400" />
      default: return <Activity className="w-5 h-5 text-gray-400" />
    }
  }

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'critical': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-6">
      
      {/* System Status Header */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {getStatusIcon(systemStatus.status)}
            <div>
              <h2 className="text-xl font-semibold text-white">System Status</h2>
              <p className={`text-sm font-medium ${getStatusColor(systemStatus.status)}`}>
                {systemStatus.status.toUpperCase()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-400">Uptime</p>
              <p className="text-white font-medium">{formatUptime(systemStatus.uptime)}</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              disabled={isRefreshing}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 text-gray-300 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Quick Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Cpu className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-400">Memory</span>
            </div>
            <p className="text-lg font-semibold text-white">
              {(systemStatus.memoryUsage * 100).toFixed(1)}%
            </p>
          </div>

          <div className="bg-gray-900 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Database className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-400">Cache Hit</span>
            </div>
            <p className="text-lg font-semibold text-white">
              {(systemStatus.cacheHitRate * 100).toFixed(1)}%
            </p>
          </div>

          <div className="bg-gray-900 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-gray-400">Throughput</span>
            </div>
            <p className="text-lg font-semibold text-white">
              {systemStatus.throughput.toFixed(1)}/min
            </p>
          </div>

          <div className="bg-gray-900 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span className="text-sm text-gray-400">Error Rate</span>
            </div>
            <p className="text-lg font-semibold text-white">
              {(systemStatus.errorRate * 100).toFixed(2)}%
            </p>
          </div>
        </div>
      </div>

      {/* Pipeline Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Pipeline Performance */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center space-x-2 mb-4">
            <Zap className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">Pipeline Performance</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Queue Size</span>
              <span className="text-white font-medium">{pipelineStats.queueSize} jobs</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Active Jobs</span>
              <span className="text-white font-medium">{pipelineStats.activeJobs} running</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Completed Today</span>
              <span className="text-green-400 font-medium">{pipelineStats.completedToday}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Failed Today</span>
              <span className="text-red-400 font-medium">{pipelineStats.failedToday}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Avg Processing Time</span>
              <span className="text-white font-medium">
                {Math.round(pipelineStats.averageProcessingTime / 1000)}s
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Total Cost Today</span>
              <span className="text-white font-medium">${pipelineStats.totalCostToday.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* API Latency Monitor */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center space-x-2 mb-4">
            <Clock className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">API Latency</h3>
          </div>
          
          <div className="space-y-4">
            {Object.entries(systemStatus.apiLatency).map(([service, latency]) => (
              <div key={service} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 capitalize">{service}</span>
                  <span className="text-white font-medium">{formatLatency(latency)}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      latency < 1000 ? 'bg-green-500' : 
                      latency < 2000 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min((latency / 3000) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics Chart */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Throughput Metrics</h3>
          </div>
          
          <select 
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value as '1h' | '6h' | '24h')}
            className="bg-gray-700 text-white text-sm rounded-lg px-3 py-2 border border-gray-600"
          >
            <option value="1h">Last Hour</option>
            <option value="6h">Last 6 Hours</option>
            <option value="24h">Last 24 Hours</option>
          </select>
        </div>
        
        <div className="h-48 bg-gray-900 rounded-lg p-4 flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-gray-600 mx-auto mb-2" />
            <p className="text-gray-400">Throughput chart visualization</p>
            <p className="text-sm text-gray-500">Would show real-time performance data</p>
          </div>
        </div>
      </div>

      {/* Active Alerts */}
      {alerts.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center space-x-2 mb-4">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <h3 className="text-lg font-semibold text-white">Active Alerts</h3>
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {alerts.length}
            </span>
          </div>
          
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-start space-x-3 p-3 bg-gray-900 rounded-lg">
                <div className={`w-3 h-3 rounded-full ${getSeverityColor(alert.severity)} mt-1`} />
                <div className="flex-1">
                  <p className="text-white text-sm">{alert.message}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    {new Date(alert.triggered).toLocaleTimeString()}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  alert.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                  alert.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                  alert.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {alert.severity}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center space-x-2 mb-4">
          <Settings className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
            Clear Cache
          </button>
          <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
            Reset Alerts
          </button>
          <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
            Export Logs
          </button>
          <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
            System Health
          </button>
        </div>
      </div>
    </div>
  )
}