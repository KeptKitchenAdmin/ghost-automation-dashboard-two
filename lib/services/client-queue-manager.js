"use strict";
// Phase 6: Client-Side Queue Manager for Cloudflare Pages
// Browser-based queue system with persistent state and background processing
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQueueManager = exports.ClientQueueManager = void 0;
class ClientQueueManager {
    constructor() {
        this.queue = [];
        this.isProcessing = false;
        this.maxConcurrentJobs = 1; // Cloudflare Pages limitation
        this.currentlyProcessing = new Set();
        this.listeners = new Map();
        this.statsListeners = [];
        this.loadQueueFromStorage();
        this.startQueueProcessor();
    }
    // Add job to queue with automatic prioritization
    addJob(type, payload, priority = 'medium', maxRetries = 3) {
        const id = `queue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const item = {
            id,
            type,
            payload,
            priority,
            status: 'pending',
            createdAt: Date.now(),
            retryCount: 0,
            maxRetries
        };
        // Insert based on priority
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        const insertIndex = this.queue.findIndex(job => priorityOrder[job.priority] > priorityOrder[priority]);
        if (insertIndex === -1) {
            this.queue.push(item);
        }
        else {
            this.queue.splice(insertIndex, 0, item);
        }
        this.saveQueueToStorage();
        this.notifyStatsUpdate();
        console.log(`🔄 Added ${type} job to queue (Priority: ${priority})`);
        return id;
    }
    // Remove job from queue
    removeJob(id) {
        const index = this.queue.findIndex(job => job.id === id);
        if (index === -1)
            return false;
        this.queue.splice(index, 1);
        this.currentlyProcessing.delete(id);
        this.saveQueueToStorage();
        this.notifyStatsUpdate();
        return true;
    }
    // Get job status
    getJobStatus(id) {
        return this.queue.find(job => job.id === id) || null;
    }
    // Get queue statistics
    getQueueStats() {
        const total = this.queue.length;
        const pending = this.queue.filter(job => job.status === 'pending').length;
        const processing = this.queue.filter(job => job.status === 'processing').length;
        const completed = this.queue.filter(job => job.status === 'completed').length;
        const failed = this.queue.filter(job => job.status === 'failed').length;
        const completedJobs = this.queue.filter(job => job.status === 'completed' && job.startedAt && job.completedAt);
        const averageTime = completedJobs.length > 0
            ? completedJobs.reduce((sum, job) => sum + (job.completedAt - job.startedAt), 0) / completedJobs.length / 1000 // Convert to seconds
            : 0;
        const successRate = total > 0 ? (completed / (completed + failed)) * 100 : 100;
        return {
            totalJobs: total,
            pendingJobs: pending,
            processingJobs: processing,
            completedJobs: completed,
            failedJobs: failed,
            averageProcessingTime: averageTime,
            successRate
        };
    }
    // Subscribe to job updates
    onJobUpdate(jobId, callback) {
        this.listeners.set(jobId, callback);
        return () => this.listeners.delete(jobId);
    }
    // Subscribe to stats updates
    onStatsUpdate(callback) {
        this.statsListeners.push(callback);
        return () => {
            const index = this.statsListeners.indexOf(callback);
            if (index > -1)
                this.statsListeners.splice(index, 1);
        };
    }
    // Clear completed jobs older than specified time
    clearOldJobs(olderThanMs = 24 * 60 * 60 * 1000) {
        const cutoff = Date.now() - olderThanMs;
        const initialLength = this.queue.length;
        this.queue = this.queue.filter(job => job.status === 'pending' ||
            job.status === 'processing' ||
            job.createdAt > cutoff);
        const removed = initialLength - this.queue.length;
        if (removed > 0) {
            this.saveQueueToStorage();
            this.notifyStatsUpdate();
        }
        return removed;
    }
    // Pause/resume queue processing
    pauseQueue() {
        this.isProcessing = false;
        console.log('🛑 Queue processing paused');
    }
    resumeQueue() {
        this.isProcessing = true;
        this.processQueue();
        console.log('▶️ Queue processing resumed');
    }
    // Get pending jobs
    getPendingJobs() {
        return this.queue.filter(job => job.status === 'pending');
    }
    // Get all jobs with optional filtering
    getAllJobs(filter) {
        if (!filter)
            return [...this.queue];
        return this.queue.filter(job => {
            if (filter.status && job.status !== filter.status)
                return false;
            if (filter.type && job.type !== filter.type)
                return false;
            return true;
        });
    }
    // Private: Start the queue processor
    startQueueProcessor() {
        this.isProcessing = true;
        this.processQueue();
        // Process queue every 5 seconds
        setInterval(() => {
            if (this.isProcessing) {
                this.processQueue();
            }
        }, 5000);
        // Clean old jobs every hour
        setInterval(() => {
            this.clearOldJobs();
        }, 60 * 60 * 1000);
    }
    // Private: Process the queue
    async processQueue() {
        if (!this.isProcessing || this.currentlyProcessing.size >= this.maxConcurrentJobs) {
            return;
        }
        const pendingJobs = this.queue.filter(job => job.status === 'pending');
        if (pendingJobs.length === 0)
            return;
        const availableSlots = this.maxConcurrentJobs - this.currentlyProcessing.size;
        const jobsToProcess = pendingJobs.slice(0, availableSlots);
        for (const job of jobsToProcess) {
            this.processJob(job);
        }
    }
    // Private: Process individual job
    async processJob(job) {
        this.currentlyProcessing.add(job.id);
        // Update job status
        job.status = 'processing';
        job.startedAt = Date.now();
        this.updateJob(job);
        try {
            console.log(`🔄 Processing ${job.type} job ${job.id}`);
            // Process based on job type
            switch (job.type) {
                case 'video_generation':
                    await this.processVideoGeneration(job);
                    break;
                case 'story_enhancement':
                    await this.processStoryEnhancement(job);
                    break;
                case 'batch_process':
                    await this.processBatchOperation(job);
                    break;
                default:
                    throw new Error(`Unknown job type: ${job.type}`);
            }
            // Mark as completed
            job.status = 'completed';
            job.completedAt = Date.now();
            console.log(`✅ Completed ${job.type} job ${job.id} in ${(job.completedAt - job.startedAt) / 1000}s`);
        }
        catch (error) {
            console.error(`❌ Failed ${job.type} job ${job.id}:`, error);
            // Handle retry logic
            if (job.retryCount < job.maxRetries) {
                job.retryCount++;
                job.status = 'pending';
                job.startedAt = undefined;
                console.log(`🔄 Retrying ${job.type} job ${job.id} (attempt ${job.retryCount}/${job.maxRetries})`);
            }
            else {
                job.status = 'failed';
                job.error = error.message;
                job.completedAt = Date.now();
            }
        }
        finally {
            this.currentlyProcessing.delete(job.id);
            this.updateJob(job);
        }
    }
    // Private: Process video generation job
    async processVideoGeneration(job) {
        const request = job.payload;
        // Import services dynamically to avoid issues with static export
        const { OptimizedVideoPipeline } = await Promise.resolve().then(() => __importStar(require('./optimized-video-pipeline')));
        const pipeline = new OptimizedVideoPipeline();
        const result = await pipeline.generateVideo(request);
        job.payload.result = result;
    }
    // Private: Process story enhancement job
    async processStoryEnhancement(job) {
        const { story, targetDuration } = job.payload;
        const { ClaudeService } = await Promise.resolve().then(() => __importStar(require('./claude-service')));
        const claudeService = new ClaudeService();
        const enhanced = await claudeService.enhanceStory(story, targetDuration);
        job.payload.result = { enhanced };
    }
    // Private: Process batch operation
    async processBatchOperation(job) {
        const { operations } = job.payload;
        const results = [];
        for (const operation of operations) {
            const subJobId = this.addJob(operation.type, operation.payload, 'low', 1);
            // Wait for sub-job completion
            await this.waitForJobCompletion(subJobId);
            const subJob = this.getJobStatus(subJobId);
            if (subJob?.status === 'completed') {
                results.push(subJob.payload.result);
            }
            else {
                throw new Error(`Sub-job ${subJobId} failed: ${subJob?.error}`);
            }
        }
        job.payload.result = { results };
    }
    // Private: Wait for job completion
    async waitForJobCompletion(jobId) {
        return new Promise((resolve, reject) => {
            const checkStatus = () => {
                const job = this.getJobStatus(jobId);
                if (!job) {
                    reject(new Error(`Job ${jobId} not found`));
                    return;
                }
                if (job.status === 'completed') {
                    resolve();
                }
                else if (job.status === 'failed') {
                    reject(new Error(`Job ${jobId} failed: ${job.error}`));
                }
                else {
                    setTimeout(checkStatus, 1000);
                }
            };
            checkStatus();
        });
    }
    // Private: Update job and notify listeners
    updateJob(job) {
        this.saveQueueToStorage();
        this.notifyStatsUpdate();
        const listener = this.listeners.get(job.id);
        if (listener) {
            listener(job);
        }
    }
    // Private: Notify stats listeners
    notifyStatsUpdate() {
        const stats = this.getQueueStats();
        this.statsListeners.forEach(listener => listener(stats));
    }
    // Private: Save queue to browser storage
    saveQueueToStorage() {
        try {
            if (typeof window !== 'undefined') {
                localStorage.setItem('video_queue', JSON.stringify(this.queue));
            }
        }
        catch (error) {
            console.error('Failed to save queue to storage:', error);
        }
    }
    // Private: Load queue from browser storage
    loadQueueFromStorage() {
        try {
            if (typeof window !== 'undefined') {
                const stored = localStorage.getItem('video_queue');
                if (stored) {
                    this.queue = JSON.parse(stored);
                    // Reset processing jobs to pending on reload
                    this.queue.forEach(job => {
                        if (job.status === 'processing') {
                            job.status = 'pending';
                            job.startedAt = undefined;
                        }
                    });
                }
            }
        }
        catch (error) {
            console.error('Failed to load queue from storage:', error);
            this.queue = [];
        }
    }
}
exports.ClientQueueManager = ClientQueueManager;
// Singleton instance for global queue management
let queueManagerInstance = null;
const getQueueManager = () => {
    if (!queueManagerInstance) {
        queueManagerInstance = new ClientQueueManager();
    }
    return queueManagerInstance;
};
exports.getQueueManager = getQueueManager;
