// Phase 6: Intelligent Reddit Data Caching Service
// Optimized caching for Reddit stories with smart invalidation and prefetching

import { RedditStory } from '../types/reddit-automation'

interface CacheEntry {
  key: string
  data: RedditStory[]
  timestamp: number
  expiresAt: number
  accessCount: number
  category: string
  freshness: 'fresh' | 'stale' | 'expired'
}

interface CacheMetrics {
  hits: number
  misses: number
  hitRate: number
  totalEntries: number
  memoryUsage: number
  averageAccessTime: number
}

interface CacheConfig {
  maxEntries: number
  defaultTTL: number
  freshThreshold: number
  staleThreshold: number
  enablePrefetching: boolean
  enableCompression: boolean
}

interface PrefetchJob {
  category: string
  priority: 'high' | 'medium' | 'low'
  scheduledTime: number
  executed: boolean
}

export class RedditCacheService {
  private cache: Map<string, CacheEntry> = new Map()
  private metrics: CacheMetrics
  private config: CacheConfig
  private prefetchQueue: PrefetchJob[] = []
  private isInitialized: boolean = false

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      maxEntries: 100,
      defaultTTL: 1800000, // 30 minutes
      freshThreshold: 300000, // 5 minutes
      staleThreshold: 1200000, // 20 minutes
      enablePrefetching: true,
      enableCompression: false, // Disable for now due to complexity
      ...config
    }

    this.metrics = {
      hits: 0,
      misses: 0,
      hitRate: 0,
      totalEntries: 0,
      memoryUsage: 0,
      averageAccessTime: 0
    }

    this.initialize()
  }

  /**
   * Initialize the cache service
   */
  private initialize(): void {
    if (this.isInitialized) return

    console.log('🗄️ Initializing Reddit cache service')
    
    // Load existing cache from localStorage if available
    this.loadCacheFromStorage()
    
    // Setup periodic maintenance
    setInterval(() => this.performMaintenance(), 300000) // 5 minutes
    
    // Setup prefetch scheduler
    if (this.config.enablePrefetching) {
      setInterval(() => this.processPrefetchQueue(), 60000) // 1 minute
    }
    
    this.isInitialized = true
    console.log('✅ Reddit cache service initialized')
  }

  /**
   * Get cached Reddit stories for a category
   */
  async getCachedStories(category: string, limit: number = 15): Promise<RedditStory[] | null> {
    const startTime = Date.now()
    const cacheKey = this.generateCacheKey(category, limit)
    
    const entry = this.cache.get(cacheKey)
    if (!entry) {
      this.metrics.misses++
      this.updateMetrics(Date.now() - startTime)
      console.log(`💨 Cache miss for category: ${category}`)
      
      // Schedule prefetch for this category
      this.schedulePrefetch(category, 'medium')
      
      return null
    }

    // Check if entry is expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(cacheKey)
      this.metrics.misses++
      this.updateMetrics(Date.now() - startTime)
      console.log(`⏰ Cache expired for category: ${category}`)
      
      // Schedule immediate prefetch
      this.schedulePrefetch(category, 'high')
      
      return null
    }

    // Update entry access metadata
    entry.accessCount++
    entry.freshness = this.calculateFreshness(entry)
    
    this.metrics.hits++
    this.updateMetrics(Date.now() - startTime)
    
    console.log(`✨ Cache hit for category: ${category} (freshness: ${entry.freshness})`)
    
    // If data is stale, schedule background refresh
    if (entry.freshness === 'stale') {
      this.schedulePrefetch(category, 'low')
    }
    
    return entry.data
  }

  /**
   * Cache Reddit stories with intelligent metadata
   */
  async cacheStories(category: string, stories: RedditStory[], limit: number = 15): Promise<void> {
    if (stories.length === 0) return

    const cacheKey = this.generateCacheKey(category, limit)
    const timestamp = Date.now()
    
    const entry: CacheEntry = {
      key: cacheKey,
      data: stories,
      timestamp,
      expiresAt: timestamp + this.config.defaultTTL,
      accessCount: 0,
      category,
      freshness: 'fresh'
    }

    // Ensure we don't exceed max entries
    if (this.cache.size >= this.config.maxEntries) {
      this.evictLeastUsed()
    }

    this.cache.set(cacheKey, entry)
    this.metrics.totalEntries = this.cache.size
    
    // Save to localStorage for persistence
    this.saveCacheToStorage(cacheKey, entry)
    
    console.log(`💾 Cached ${stories.length} stories for category: ${category}`)
  }

  /**
   * Intelligent prefetching based on usage patterns
   */
  private async schedulePrefetch(category: string, priority: 'high' | 'medium' | 'low'): Promise<void> {
    if (!this.config.enablePrefetching) return

    // Check if already scheduled
    const existingJob = this.prefetchQueue.find(job => 
      job.category === category && !job.executed
    )
    
    if (existingJob) {
      // Update priority if higher
      if (this.getPriorityWeight(priority) > this.getPriorityWeight(existingJob.priority)) {
        existingJob.priority = priority
      }
      return
    }

    // Schedule new prefetch job
    const scheduledTime = Date.now() + this.getPrefetchDelay(priority)
    const job: PrefetchJob = {
      category,
      priority,
      scheduledTime,
      executed: false
    }

    this.prefetchQueue.push(job)
    console.log(`📋 Scheduled prefetch for ${category} (priority: ${priority})`)
  }

  /**
   * Process the prefetch queue
   */
  private async processPrefetchQueue(): Promise<void> {
    const now = Date.now()
    const readyJobs = this.prefetchQueue.filter(job => 
      !job.executed && job.scheduledTime <= now
    )

    if (readyJobs.length === 0) return

    // Sort by priority and execute
    readyJobs
      .sort((a, b) => this.getPriorityWeight(b.priority) - this.getPriorityWeight(a.priority))
      .slice(0, 2) // Process max 2 jobs at once
      .forEach(job => this.executePrefetch(job))
  }

  /**
   * Execute a prefetch job
   */
  private async executePrefetch(job: PrefetchJob): Promise<void> {
    try {
      console.log(`🔄 Executing prefetch for category: ${job.category}`)
      
      job.executed = true
      
      // Import and use Reddit scraper
      const { RedditScraperService } = await import('./reddit-scraper')
      const scraper = new RedditScraperService()
      
      const stories = await scraper.scrapeRedditStories(job.category as any, 15)
      
      if (stories.length > 0) {
        await this.cacheStories(job.category, stories, 15)
        console.log(`✅ Prefetch completed for ${job.category}: ${stories.length} stories`)
      }
      
    } catch (error) {
      console.error(`❌ Prefetch failed for ${job.category}:`, error)
    }
    
    // Remove completed job
    this.prefetchQueue = this.prefetchQueue.filter(j => j !== job)
  }

  /**
   * Generate cache key for consistency
   */
  private generateCacheKey(category: string, limit: number): string {
    return `reddit_${category}_${limit}`
  }

  /**
   * Calculate data freshness
   */
  private calculateFreshness(entry: CacheEntry): 'fresh' | 'stale' | 'expired' {
    const age = Date.now() - entry.timestamp
    
    if (age < this.config.freshThreshold) return 'fresh'
    if (age < this.config.staleThreshold) return 'stale'
    return 'expired'
  }

  /**
   * Evict least recently used entries
   */
  private evictLeastUsed(): void {
    if (this.cache.size === 0) return

    // Find entry with lowest access count and oldest timestamp
    let lruEntry: CacheEntry | null = null
    let lruKey: string = ''
    
    for (const [key, entry] of this.cache.entries()) {
      if (!lruEntry || 
          entry.accessCount < lruEntry.accessCount ||
          (entry.accessCount === lruEntry.accessCount && entry.timestamp < lruEntry.timestamp)) {
        lruEntry = entry
        lruKey = key
      }
    }
    
    if (lruKey) {
      this.cache.delete(lruKey)
      this.removeCacheFromStorage(lruKey)
      console.log(`🗑️ Evicted LRU cache entry: ${lruKey}`)
    }
  }

  /**
   * Get priority weight for sorting
   */
  private getPriorityWeight(priority: 'high' | 'medium' | 'low'): number {
    switch (priority) {
      case 'high': return 3
      case 'medium': return 2
      case 'low': return 1
      default: return 0
    }
  }

  /**
   * Get prefetch delay based on priority
   */
  private getPrefetchDelay(priority: 'high' | 'medium' | 'low'): number {
    switch (priority) {
      case 'high': return 1000 // 1 second
      case 'medium': return 30000 // 30 seconds
      case 'low': return 300000 // 5 minutes
      default: return 60000
    }
  }

  /**
   * Perform periodic cache maintenance
   */
  private performMaintenance(): void {
    const startTime = Date.now()
    let cleanedEntries = 0
    let totalSize = 0

    // Remove expired entries
    for (const [key, entry] of this.cache.entries()) {
      totalSize += this.estimateEntrySize(entry)
      
      if (Date.now() > entry.expiresAt) {
        this.cache.delete(key)
        this.removeCacheFromStorage(key)
        cleanedEntries++
      }
    }

    // Update metrics
    this.metrics.totalEntries = this.cache.size
    this.metrics.memoryUsage = totalSize
    this.updateHitRate()

    const maintenanceTime = Date.now() - startTime
    
    if (cleanedEntries > 0 || maintenanceTime > 100) {
      console.log(`🧹 Cache maintenance: removed ${cleanedEntries} expired entries in ${maintenanceTime}ms`)
    }
  }

  /**
   * Estimate memory usage of cache entry
   */
  private estimateEntrySize(entry: CacheEntry): number {
    // Rough estimation: JSON string length * 2 for UTF-16
    return JSON.stringify(entry).length * 2
  }

  /**
   * Update performance metrics
   */
  private updateMetrics(accessTime: number): void {
    const totalAccess = this.metrics.hits + this.metrics.misses
    
    if (totalAccess > 0) {
      this.metrics.averageAccessTime = 
        (this.metrics.averageAccessTime * (totalAccess - 1) + accessTime) / totalAccess
    }
    
    this.updateHitRate()
  }

  /**
   * Update hit rate metric
   */
  private updateHitRate(): void {
    const totalAccess = this.metrics.hits + this.metrics.misses
    this.metrics.hitRate = totalAccess > 0 ? this.metrics.hits / totalAccess : 0
  }

  /**
   * Save cache entry to localStorage
   */
  private saveCacheToStorage(key: string, entry: CacheEntry): void {
    if (typeof window === 'undefined') return

    try {
      const storageKey = `reddit_cache_${key}`
      const serialized = JSON.stringify({
        data: entry.data,
        timestamp: entry.timestamp,
        expiresAt: entry.expiresAt,
        category: entry.category
      })
      
      localStorage.setItem(storageKey, serialized)
    } catch (error) {
      console.warn('Failed to save cache to localStorage:', error)
    }
  }

  /**
   * Load cache from localStorage on initialization
   */
  private loadCacheFromStorage(): void {
    if (typeof window === 'undefined') return

    try {
      const keys = Object.keys(localStorage).filter(key => 
        key.startsWith('reddit_cache_')
      )
      
      let loadedEntries = 0
      
      for (const storageKey of keys) {
        const cacheKey = storageKey.replace('reddit_cache_', '')
        const serialized = localStorage.getItem(storageKey)
        
        if (serialized) {
          const stored = JSON.parse(serialized)
          
          // Check if still valid
          if (Date.now() < stored.expiresAt) {
            const entry: CacheEntry = {
              key: cacheKey,
              data: stored.data,
              timestamp: stored.timestamp,
              expiresAt: stored.expiresAt,
              accessCount: 0,
              category: stored.category,
              freshness: this.calculateFreshness({
                timestamp: stored.timestamp,
                expiresAt: stored.expiresAt
              } as CacheEntry)
            }
            
            this.cache.set(cacheKey, entry)
            loadedEntries++
          } else {
            // Remove expired entry
            localStorage.removeItem(storageKey)
          }
        }
      }
      
      if (loadedEntries > 0) {
        console.log(`📦 Loaded ${loadedEntries} cache entries from localStorage`)
      }
      
    } catch (error) {
      console.warn('Failed to load cache from localStorage:', error)
    }
  }

  /**
   * Remove cache entry from localStorage
   */
  private removeCacheFromStorage(key: string): void {
    if (typeof window === 'undefined') return

    try {
      const storageKey = `reddit_cache_${key}`
      localStorage.removeItem(storageKey)
    } catch (error) {
      console.warn('Failed to remove cache from localStorage:', error)
    }
  }

  /**
   * Get cache statistics and performance metrics
   */
  getMetrics(): CacheMetrics & { cacheEntries: Array<{
    key: string
    category: string
    age: number
    freshness: string
    accessCount: number
    size: number
  }> } {
    const cacheEntries = Array.from(this.cache.entries()).map(([key, entry]) => ({
      key,
      category: entry.category,
      age: Date.now() - entry.timestamp,
      freshness: entry.freshness,
      accessCount: entry.accessCount,
      size: this.estimateEntrySize(entry)
    }))

    return {
      ...this.metrics,
      cacheEntries
    }
  }

  /**
   * Warm up cache with popular categories
   */
  async warmupCache(categories: string[] = ['drama', 'horror', 'revenge']): Promise<void> {
    console.log(`🔥 Warming up cache for categories: ${categories.join(', ')}`)
    
    for (const category of categories) {
      this.schedulePrefetch(category, 'medium')
    }
  }

  /**
   * Clear entire cache
   */
  clearCache(): void {
    this.cache.clear()
    this.prefetchQueue.length = 0
    
    // Clear localStorage entries
    if (typeof window !== 'undefined') {
      const keys = Object.keys(localStorage).filter(key => 
        key.startsWith('reddit_cache_')
      )
      
      keys.forEach(key => localStorage.removeItem(key))
    }
    
    // Reset metrics
    this.metrics = {
      hits: 0,
      misses: 0,
      hitRate: 0,
      totalEntries: 0,
      memoryUsage: 0,
      averageAccessTime: 0
    }
    
    console.log('🗑️ Cache cleared completely')
  }

  /**
   * Force refresh cache for specific category
   */
  async forceRefresh(category: string): Promise<void> {
    const cacheKey = this.generateCacheKey(category, 15)
    
    // Remove existing cache
    this.cache.delete(cacheKey)
    this.removeCacheFromStorage(cacheKey)
    
    // Schedule immediate prefetch
    this.schedulePrefetch(category, 'high')
    
    console.log(`🔄 Force refresh initiated for category: ${category}`)
  }

  /**
   * Get cached usage statistics
   */
  getCachedUsageStats(): any {
    try {
      const cached = localStorage.getItem('usage_stats_cache')
      if (cached) {
        const data = JSON.parse(cached)
        // Check if cache is still valid (5 minutes)
        if (Date.now() - data.timestamp < 300000) {
          return data.stats
        }
      }
      return null
    } catch (error) {
      console.error('Failed to get cached usage stats:', error)
      return null
    }
  }

  /**
   * Cache usage statistics
   */
  cacheUsageStats(stats: any): void {
    try {
      const cacheData = {
        stats,
        timestamp: Date.now()
      }
      localStorage.setItem('usage_stats_cache', JSON.stringify(cacheData))
    } catch (error) {
      console.error('Failed to cache usage stats:', error)
    }
  }
}

// Export singleton instance
export const redditCache = new RedditCacheService({
  maxEntries: 50,
  defaultTTL: 1800000, // 30 minutes
  freshThreshold: 300000, // 5 minutes
  staleThreshold: 1200000, // 20 minutes
  enablePrefetching: true,
  enableCompression: false
})