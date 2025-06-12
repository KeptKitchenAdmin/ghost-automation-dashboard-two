// Phase 6: Performance Monitoring Service
// Real-time monitoring and analytics for video generation pipeline

interface PerformanceMetric {
  timestamp: number
  metric: string
  value: number
  unit: string
  metadata?: Record<string, any>
}

interface SystemHealth {
  status: 'healthy' | 'degraded' | 'critical'
  uptime: number
  memoryUsage: number
  cacheHitRate: number
  apiLatency: Record<string, number>
  errorRate: number
  throughput: number
}

interface AlertRule {
  id: string
  metric: string
  condition: 'gt' | 'lt' | 'eq'
  threshold: number
  window: number // time window in ms
  enabled: boolean
}

interface PerformanceAlert {
  id: string
  rule: AlertRule
  triggered: number
  message: string
  severity: 'low' | 'medium' | 'high' | 'critical'
}

export class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []
  private alerts: PerformanceAlert[] = []
  private alertRules: AlertRule[] = []
  private systemStartTime: number
  private metricsRetentionMs: number
  private isMonitoring: boolean = false

  constructor() {
    this.systemStartTime = Date.now()
    this.metricsRetentionMs = 24 * 60 * 60 * 1000 // 24 hours
    
    // Initialize default alert rules
    this.initializeDefaultAlerts()
    
    // Start monitoring
    this.startMonitoring()
  }

  /**
   * Initialize default performance alert rules
   */
  private initializeDefaultAlerts(): void {
    this.alertRules = [
      {
        id: 'high_api_latency',
        metric: 'api_latency',
        condition: 'gt',
        threshold: 10000, // 10 seconds
        window: 300000, // 5 minutes
        enabled: true
      },
      {
        id: 'low_cache_hit_rate',
        metric: 'cache_hit_rate',
        condition: 'lt',
        threshold: 0.5, // 50%
        window: 600000, // 10 minutes
        enabled: true
      },
      {
        id: 'high_error_rate',
        metric: 'error_rate',
        condition: 'gt',
        threshold: 0.1, // 10%
        window: 300000, // 5 minutes
        enabled: true
      },
      {
        id: 'high_memory_usage',
        metric: 'memory_usage',
        condition: 'gt',
        threshold: 0.85, // 85%
        window: 180000, // 3 minutes
        enabled: true
      },
      {
        id: 'low_throughput',
        metric: 'throughput',
        condition: 'lt',
        threshold: 0.5, // videos per minute
        window: 900000, // 15 minutes
        enabled: true
      }
    ]
  }

  /**
   * Start performance monitoring
   */
  private startMonitoring(): void {
    if (this.isMonitoring) return
    
    this.isMonitoring = true
    console.log('📊 Performance monitoring started')
    
    // Collect system metrics every 30 seconds
    setInterval(() => this.collectSystemMetrics(), 30000)
    
    // Cleanup old metrics every hour
    setInterval(() => this.cleanupOldMetrics(), 3600000)
    
    // Check alert rules every minute
    setInterval(() => this.checkAlertRules(), 60000)
  }

  /**
   * Record a performance metric
   */
  recordMetric(
    metric: string, 
    value: number, 
    unit: string = '', 
    metadata?: Record<string, any>
  ): void {
    const performanceMetric: PerformanceMetric = {
      timestamp: Date.now(),
      metric,
      value,
      unit,
      metadata
    }
    
    this.metrics.push(performanceMetric)
    
    // Console logging for development
    if (process.env.NODE_ENV === 'development') {
      console.log(`📈 Metric: ${metric} = ${value}${unit}`, metadata || '')
    }
  }

  /**
   * Record API latency metrics
   */
  recordApiLatency(service: string, latency: number): void {
    this.recordMetric(`api_latency_${service}`, latency, 'ms', { service })
    this.recordMetric('api_latency', latency, 'ms', { service })
  }

  /**
   * Record video generation metrics
   */
  recordVideoGeneration(
    duration: number, 
    success: boolean, 
    cost: number,
    processingTime: number
  ): void {
    this.recordMetric('video_generation_time', processingTime, 'ms')
    this.recordMetric('video_generation_cost', cost, 'usd')
    this.recordMetric('video_duration', duration, 'seconds')
    this.recordMetric('video_generation_success', success ? 1 : 0, 'boolean')
    
    // Calculate throughput (videos per minute)
    const recentGenerations = this.getMetricsInWindow('video_generation_success', 60000)
    const throughput = recentGenerations.length
    this.recordMetric('throughput', throughput, 'videos/min')
  }

  /**
   * Record cache performance
   */
  recordCachePerformance(hits: number, misses: number): void {
    const total = hits + misses
    const hitRate = total > 0 ? hits / total : 0
    
    this.recordMetric('cache_hits', hits, 'count')
    this.recordMetric('cache_misses', misses, 'count')
    this.recordMetric('cache_hit_rate', hitRate, 'percentage')
  }

  /**
   * Record error metrics
   */
  recordError(service: string, errorType: string, message: string): void {
    this.recordMetric('error_count', 1, 'count', { 
      service, 
      errorType, 
      message 
    })
    
    // Calculate error rate over last 5 minutes
    const totalOperations = this.getMetricsInWindow('video_generation_success', 300000)
    const errorOperations = this.getMetricsInWindow('error_count', 300000)
    const errorRate = totalOperations.length > 0 ? 
      errorOperations.length / totalOperations.length : 0
    
    this.recordMetric('error_rate', errorRate, 'percentage')
  }

  /**
   * Collect system-level metrics
   */
  private collectSystemMetrics(): void {
    // Memory usage (simplified for browser environment)
    if (typeof performance !== 'undefined' && (performance as any).memory) {
      const memory = (performance as any).memory
      const memoryUsage = memory.usedJSHeapSize / memory.totalJSHeapSize
      this.recordMetric('memory_usage', memoryUsage, 'percentage')
    }
    
    // System uptime
    const uptime = Date.now() - this.systemStartTime
    this.recordMetric('uptime', uptime, 'ms')
    
    // Calculate average API latencies
    const services = ['claude', 'shotstack', 'elevenlabs']
    services.forEach(service => {
      const latencies = this.getMetricsInWindow(`api_latency_${service}`, 300000)
      if (latencies.length > 0) {
        const avgLatency = latencies.reduce((sum, m) => sum + m.value, 0) / latencies.length
        this.recordMetric(`avg_api_latency_${service}`, avgLatency, 'ms')
      }
    })
  }

  /**
   * Get metrics within a time window
   */
  private getMetricsInWindow(metric: string, windowMs: number): PerformanceMetric[] {
    const cutoff = Date.now() - windowMs
    return this.metrics.filter(m => 
      m.metric === metric && m.timestamp >= cutoff
    )
  }

  /**
   * Check alert rules and trigger alerts
   */
  private checkAlertRules(): void {
    this.alertRules.forEach(rule => {
      if (!rule.enabled) return
      
      const metrics = this.getMetricsInWindow(rule.metric, rule.window)
      if (metrics.length === 0) return
      
      // Calculate average value in window
      const avgValue = metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length
      
      // Check condition
      let triggered = false
      switch (rule.condition) {
        case 'gt':
          triggered = avgValue > rule.threshold
          break
        case 'lt':
          triggered = avgValue < rule.threshold
          break
        case 'eq':
          triggered = Math.abs(avgValue - rule.threshold) < 0.01
          break
      }
      
      if (triggered) {
        this.triggerAlert(rule, avgValue)
      }
    })
  }

  /**
   * Trigger a performance alert
   */
  private triggerAlert(rule: AlertRule, value: number): void {
    // Check if we already have a recent alert for this rule
    const recentAlerts = this.alerts.filter(alert => 
      alert.rule.id === rule.id && 
      (Date.now() - alert.triggered) < 300000 // 5 minutes
    )
    
    if (recentAlerts.length > 0) return // Don't spam alerts
    
    const alert: PerformanceAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      rule,
      triggered: Date.now(),
      message: this.generateAlertMessage(rule, value),
      severity: this.determineSeverity(rule, value)
    }
    
    this.alerts.push(alert)
    
    // Log alert
    console.warn(`🚨 Performance Alert: ${alert.message}`)
    
    // In a real system, you would send this to monitoring services
    // like Datadog, New Relic, or custom alerting systems
  }

  /**
   * Generate human-readable alert message
   */
  private generateAlertMessage(rule: AlertRule, value: number): string {
    const formatValue = (val: number, unit: string) => {
      if (unit === 'ms') return `${val.toFixed(0)}ms`
      if (unit === 'percentage') return `${(val * 100).toFixed(1)}%`
      return `${val.toFixed(2)}`
    }
    
    const formattedValue = formatValue(value, this.getMetricUnit(rule.metric))
    const formattedThreshold = formatValue(rule.threshold, this.getMetricUnit(rule.metric))
    
    switch (rule.id) {
      case 'high_api_latency':
        return `API latency is high: ${formattedValue} (threshold: ${formattedThreshold})`
      case 'low_cache_hit_rate':
        return `Cache hit rate is low: ${formattedValue} (threshold: ${formattedThreshold})`
      case 'high_error_rate':
        return `Error rate is high: ${formattedValue} (threshold: ${formattedThreshold})`
      case 'high_memory_usage':
        return `Memory usage is high: ${formattedValue} (threshold: ${formattedThreshold})`
      case 'low_throughput':
        return `Throughput is low: ${formattedValue} videos/min (threshold: ${formattedThreshold})`
      default:
        return `Alert: ${rule.metric} ${rule.condition} ${formattedThreshold} (current: ${formattedValue})`
    }
  }

  /**
   * Determine alert severity
   */
  private determineSeverity(rule: AlertRule, value: number): PerformanceAlert['severity'] {
    const deviation = Math.abs(value - rule.threshold) / rule.threshold
    
    if (deviation > 2) return 'critical'
    if (deviation > 1) return 'high'
    if (deviation > 0.5) return 'medium'
    return 'low'
  }

  /**
   * Get metric unit for formatting
   */
  private getMetricUnit(metric: string): string {
    if (metric.includes('latency')) return 'ms'
    if (metric.includes('rate') || metric.includes('usage')) return 'percentage'
    if (metric.includes('throughput')) return 'videos/min'
    return ''
  }

  /**
   * Cleanup old metrics to prevent memory leaks
   */
  private cleanupOldMetrics(): void {
    const cutoff = Date.now() - this.metricsRetentionMs
    const initialCount = this.metrics.length
    
    this.metrics = this.metrics.filter(m => m.timestamp >= cutoff)
    
    const cleaned = initialCount - this.metrics.length
    if (cleaned > 0) {
      console.log(`🧹 Cleaned ${cleaned} old performance metrics`)
    }
    
    // Also cleanup old alerts (keep for 24 hours)
    this.alerts = this.alerts.filter(a => (Date.now() - a.triggered) < 86400000)
  }

  /**
   * Get system health summary
   */
  getSystemHealth(): SystemHealth {
    const now = Date.now()
    const uptime = now - this.systemStartTime
    
    // Calculate recent metrics
    const recentMetrics = this.metrics.filter(m => now - m.timestamp < 300000) // 5 minutes
    
    // Memory usage
    const memoryMetrics = recentMetrics.filter(m => m.metric === 'memory_usage')
    const memoryUsage = memoryMetrics.length > 0 ? 
      memoryMetrics[memoryMetrics.length - 1].value : 0
    
    // Cache hit rate
    const cacheMetrics = recentMetrics.filter(m => m.metric === 'cache_hit_rate')
    const cacheHitRate = cacheMetrics.length > 0 ? 
      cacheMetrics[cacheMetrics.length - 1].value : 0
    
    // API latencies
    const apiLatency: Record<string, number> = {}
    const services = ['claude', 'shotstack', 'elevenlabs']
    services.forEach(service => {
      const latencies = recentMetrics.filter(m => m.metric === `avg_api_latency_${service}`)
      apiLatency[service] = latencies.length > 0 ? 
        latencies[latencies.length - 1].value : 0
    })
    
    // Error rate
    const errorMetrics = recentMetrics.filter(m => m.metric === 'error_rate')
    const errorRate = errorMetrics.length > 0 ? 
      errorMetrics[errorMetrics.length - 1].value : 0
    
    // Throughput
    const throughputMetrics = recentMetrics.filter(m => m.metric === 'throughput')
    const throughput = throughputMetrics.length > 0 ? 
      throughputMetrics[throughputMetrics.length - 1].value : 0
    
    // Determine overall status
    let status: SystemHealth['status'] = 'healthy'
    if (errorRate > 0.2 || memoryUsage > 0.9) {
      status = 'critical'
    } else if (errorRate > 0.1 || memoryUsage > 0.85 || cacheHitRate < 0.3) {
      status = 'degraded'
    }
    
    return {
      status,
      uptime,
      memoryUsage,
      cacheHitRate,
      apiLatency,
      errorRate,
      throughput
    }
  }

  /**
   * Get performance metrics for dashboard
   */
  getMetrics(metric?: string, windowMs: number = 3600000): PerformanceMetric[] {
    if (metric) {
      return this.getMetricsInWindow(metric, windowMs)
    }
    
    const cutoff = Date.now() - windowMs
    return this.metrics.filter(m => m.timestamp >= cutoff)
  }

  /**
   * Get recent alerts
   */
  getAlerts(windowMs: number = 3600000): PerformanceAlert[] {
    const cutoff = Date.now() - windowMs
    return this.alerts.filter(a => a.triggered >= cutoff)
  }

  /**
   * Clear all alerts
   */
  clearAlerts(): void {
    this.alerts.length = 0
    console.log('🗑️ All performance alerts cleared')
  }

  /**
   * Stop monitoring
   */
  stopMonitoring(): void {
    this.isMonitoring = false
    console.log('📊 Performance monitoring stopped')
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor()