"use strict";
// Phase 6: Cloudflare Pages Scaling Strategies
// Optimizations for static export deployment and performance scaling
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScalingManager = exports.CloudflareScalingManager = void 0;
class CloudflareScalingManager {
    constructor(config = {}) {
        this.metrics = [];
        this.resourceLoads = [];
        this.prefetchQueue = new Set();
        this.requestQueue = [];
        this.isProcessingQueue = false;
        this.config = {
            enableResourceHints: true,
            enableServiceWorker: true,
            enablePrefetching: true,
            enableCompression: true,
            enableCaching: true,
            maxConcurrentRequests: 3, // Conservative for API limits
            requestBatchSize: 5,
            ...config
        };
        this.initializeScaling();
    }
    // Initialize scaling optimizations
    initializeScaling() {
        if (typeof window !== 'undefined') {
            // Setup performance monitoring
            this.setupPerformanceMonitoring();
            // Setup resource hints
            if (this.config.enableResourceHints) {
                this.setupResourceHints();
            }
            // Setup service worker for caching
            if (this.config.enableServiceWorker) {
                this.setupServiceWorker();
            }
            // Setup intelligent prefetching
            if (this.config.enablePrefetching) {
                this.setupIntelligentPrefetching();
            }
            // Setup request queue processing
            this.setupRequestQueue();
            console.log('⚡ Cloudflare scaling optimizations initialized');
        }
    }
    // Optimize API request batching
    async batchAPIRequests(requests, batchSize = this.config.requestBatchSize) {
        const results = [];
        for (let i = 0; i < requests.length; i += batchSize) {
            const batch = requests.slice(i, i + batchSize);
            try {
                const batchResults = await Promise.allSettled(batch.map(request => this.queueRequest(request)));
                batchResults.forEach((result, index) => {
                    if (result.status === 'fulfilled') {
                        results.push(result.value);
                    }
                    else {
                        console.error(`Batch request ${i + index} failed:`, result.reason);
                        // Add placeholder or handle error as needed
                    }
                });
                // Add delay between batches to avoid overwhelming APIs
                if (i + batchSize < requests.length) {
                    await this.delay(1000);
                }
            }
            catch (error) {
                console.error('Batch processing failed:', error);
            }
        }
        return results;
    }
    // Queue API request with concurrency control
    async queueRequest(request) {
        return new Promise((resolve, reject) => {
            this.requestQueue.push(async () => {
                try {
                    const result = await request();
                    resolve(result);
                    return result;
                }
                catch (error) {
                    reject(error);
                    throw error;
                }
            });
            this.processRequestQueue();
        });
    }
    // Process request queue with concurrency limits
    async processRequestQueue() {
        if (this.isProcessingQueue || this.requestQueue.length === 0) {
            return;
        }
        this.isProcessingQueue = true;
        const activeRequests = [];
        while (this.requestQueue.length > 0 || activeRequests.length > 0) {
            // Start new requests up to concurrency limit
            while (this.requestQueue.length > 0 &&
                activeRequests.length < this.config.maxConcurrentRequests) {
                const request = this.requestQueue.shift();
                const promise = request().finally(() => {
                    const index = activeRequests.indexOf(promise);
                    if (index > -1) {
                        activeRequests.splice(index, 1);
                    }
                });
                activeRequests.push(promise);
            }
            // Wait for at least one request to complete
            if (activeRequests.length > 0) {
                await Promise.race(activeRequests);
            }
        }
        this.isProcessingQueue = false;
    }
    // Intelligent resource prefetching
    setupIntelligentPrefetching() {
        // Prefetch critical API endpoints
        const criticalEndpoints = [
            '/api/reddit-automation/usage-stats',
            '/api/reddit-automation/health'
        ];
        // Prefetch on idle
        if ('requestIdleCallback' in window) {
            window.requestIdleCallback(() => {
                criticalEndpoints.forEach(endpoint => {
                    this.prefetchResource(endpoint);
                });
            });
        }
        else {
            setTimeout(() => {
                criticalEndpoints.forEach(endpoint => {
                    this.prefetchResource(endpoint);
                });
            }, 1000);
        }
        // Setup intersection observer for lazy loading
        this.setupLazyLoading();
    }
    // Prefetch resource if not already prefetched
    prefetchResource(url) {
        if (this.prefetchQueue.has(url))
            return;
        this.prefetchQueue.add(url);
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        link.onload = () => {
            console.log(`⚡ Prefetched: ${url}`);
        };
        link.onerror = () => {
            this.prefetchQueue.delete(url);
        };
        document.head.appendChild(link);
    }
    // Setup lazy loading for images and videos
    setupLazyLoading() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    if (element.tagName === 'IMG') {
                        const img = element;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                    }
                    else if (element.tagName === 'VIDEO') {
                        const video = element;
                        if (video.dataset.src) {
                            video.src = video.dataset.src;
                            video.removeAttribute('data-src');
                        }
                    }
                    observer.unobserve(element);
                }
            });
        }, { rootMargin: '50px' });
        // Observe all images and videos with data-src
        document.querySelectorAll('img[data-src], video[data-src]').forEach(el => {
            observer.observe(el);
        });
    }
    // Setup service worker for intelligent caching
    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                console.log('⚡ Service Worker registered:', registration);
                // Update service worker cache strategies
                this.updateServiceWorkerConfig();
            })
                .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
        }
    }
    // Update service worker with current caching strategies
    updateServiceWorkerConfig() {
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
                type: 'UPDATE_CACHE_STRATEGY',
                config: {
                    apiCacheDuration: 5 * 60 * 1000, // 5 minutes for API responses
                    staticCacheDuration: 24 * 60 * 60 * 1000, // 24 hours for static assets
                    enableOfflineMode: true,
                    enableBackgroundSync: true
                }
            });
        }
    }
    // Setup resource hints for critical resources
    setupResourceHints() {
        const criticalDomains = [
            'api.anthropic.com',
            'api.shotstack.io',
            'api.elevenlabs.io',
            'r2.cloudflarestorage.com'
        ];
        criticalDomains.forEach(domain => {
            // DNS prefetch
            const dnsPrefetch = document.createElement('link');
            dnsPrefetch.rel = 'dns-prefetch';
            dnsPrefetch.href = `https://${domain}`;
            document.head.appendChild(dnsPrefetch);
            // Preconnect for critical domains
            const preconnect = document.createElement('link');
            preconnect.rel = 'preconnect';
            preconnect.href = `https://${domain}`;
            document.head.appendChild(preconnect);
        });
    }
    // Setup performance monitoring
    setupPerformanceMonitoring() {
        // Web Vitals monitoring
        if ('web-vitals' in window || typeof window !== 'undefined') {
            // Monitor Core Web Vitals
            this.monitorWebVitals();
            // Monitor resource loading
            this.monitorResourceLoading();
            // Monitor long tasks
            this.monitorLongTasks();
        }
        // Send metrics periodically
        setInterval(() => {
            this.reportMetrics();
        }, 30000); // Every 30 seconds
    }
    // Monitor Web Vitals
    monitorWebVitals() {
        // LCP (Largest Contentful Paint)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('LCP:', lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });
        // FID (First Input Delay)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                console.log('FID:', entry.processingStart - entry.startTime);
            });
        }).observe({ entryTypes: ['first-input'] });
        // CLS (Cumulative Layout Shift)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                if (!entry.hadRecentInput) {
                    console.log('CLS:', entry.value);
                }
            });
        }).observe({ entryTypes: ['layout-shift'] });
    }
    // Monitor resource loading performance
    monitorResourceLoading() {
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                const resourceInfo = {
                    url: entry.name,
                    type: this.getResourceType(entry.name),
                    size: entry.transferSize || 0,
                    loadTime: entry.responseEnd - entry.startTime,
                    cached: entry.transferSize === 0
                };
                this.resourceLoads.push(resourceInfo);
                // Keep only last 100 entries
                if (this.resourceLoads.length > 100) {
                    this.resourceLoads.shift();
                }
            });
        }).observe({ entryTypes: ['resource'] });
    }
    // Monitor long tasks that block the main thread
    monitorLongTasks() {
        if ('PerformanceObserver' in window) {
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                entries.forEach(entry => {
                    console.warn('Long task detected:', entry.duration, 'ms');
                    // Log long tasks for optimization
                    if (entry.duration > 50) {
                        this.reportLongTask(entry);
                    }
                });
            }).observe({ entryTypes: ['longtask'] });
        }
    }
    // Get resource type from URL
    getResourceType(url) {
        if (url.includes('.js'))
            return 'script';
        if (url.includes('.css'))
            return 'style';
        if (url.includes('.png') || url.includes('.jpg') || url.includes('.webp'))
            return 'image';
        if (url.includes('.woff') || url.includes('.ttf'))
            return 'font';
        if (url.includes('/api/'))
            return 'data';
        return 'script';
    }
    // Report performance metrics
    reportMetrics() {
        const metrics = this.getCurrentMetrics();
        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
            console.log('📊 Performance Metrics:', metrics);
        }
        // Store metrics for analytics
        this.storeMetrics(metrics);
    }
    // Get current performance metrics
    getCurrentMetrics() {
        const navigation = performance.getEntriesByType('navigation')[0];
        return {
            timestamp: Date.now(),
            pageLoadTime: navigation.loadEventEnd - navigation.loadEventStart,
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            firstByte: navigation.responseStart - navigation.requestStart,
            domComplete: navigation.domComplete - navigation.domLoading,
            resourceCount: this.resourceLoads.length,
            cachedResources: this.resourceLoads.filter(r => r.cached).length,
            averageResourceLoadTime: this.resourceLoads.reduce((sum, r) => sum + r.loadTime, 0) / this.resourceLoads.length || 0
        };
    }
    // Store metrics for later analysis
    storeMetrics(metrics) {
        try {
            const storageKey = `performance_metrics_${new Date().toDateString()}`;
            const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
            existing.push(metrics);
            // Keep only last 50 entries per day
            if (existing.length > 50) {
                existing.shift();
            }
            localStorage.setItem(storageKey, JSON.stringify(existing));
        }
        catch (error) {
            console.error('Failed to store performance metrics:', error);
        }
    }
    // Report long task for optimization
    reportLongTask(entry) {
        console.warn('⚠️ Long task detected:', {
            duration: entry.duration,
            startTime: entry.startTime,
            name: entry.name
        });
    }
    // Optimize image loading with modern formats
    optimizeImageLoading(img) {
        // Check for WebP support
        const supportsWebP = this.supportsWebP();
        if (supportsWebP && img.dataset.webp) {
            img.src = img.dataset.webp;
        }
        else if (img.dataset.src) {
            img.src = img.dataset.src;
        }
        // Add loading="lazy" if not present
        if (!img.hasAttribute('loading')) {
            img.loading = 'lazy';
        }
    }
    // Check WebP support
    supportsWebP() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    // Utility: Delay execution
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    // Get scaling metrics
    getScalingMetrics() {
        return {
            config: this.config,
            queueLength: this.requestQueue.length,
            prefetchedResources: this.prefetchQueue.size,
            resourceLoads: this.resourceLoads.length,
            isProcessingQueue: this.isProcessingQueue,
            performance: this.getCurrentMetrics()
        };
    }
    // Cleanup old data
    cleanup() {
        // Clear old performance data
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith('performance_metrics_')) {
                const date = key.replace('performance_metrics_', '');
                const entryDate = new Date(date);
                const daysDiff = (Date.now() - entryDate.getTime()) / (1000 * 60 * 60 * 24);
                if (daysDiff > 7) {
                    localStorage.removeItem(key);
                }
            }
        }
        // Clear old resource loads
        if (this.resourceLoads.length > 200) {
            this.resourceLoads.splice(0, this.resourceLoads.length - 100);
        }
    }
}
exports.CloudflareScalingManager = CloudflareScalingManager;
// Singleton instance for global scaling management
let scalingManagerInstance = null;
const getScalingManager = () => {
    if (!scalingManagerInstance) {
        scalingManagerInstance = new CloudflareScalingManager();
    }
    return scalingManagerInstance;
};
exports.getScalingManager = getScalingManager;
