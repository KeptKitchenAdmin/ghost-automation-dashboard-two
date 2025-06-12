"use strict";
// Phase 6: Security Manager for Cloudflare Pages Static Export
// Client-side security hardening and API key protection
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSecurityManager = exports.SecurityManager = void 0;
class SecurityManager {
    constructor(config = {}) {
        this.rateLimitMap = new Map();
        this.securityEvents = [];
        this.listeners = [];
        this.config = {
            enableCSP: true,
            enableRateLimit: true,
            maxAPICallsPerMinute: 30, // Conservative limit for Cloudflare Pages
            enableRequestValidation: true,
            logSecurityEvents: true,
            ...config
        };
        this.initializeSecurity();
    }
    // Initialize security measures
    initializeSecurity() {
        if (typeof window !== 'undefined') {
            // Set up Content Security Policy for Cloudflare Pages
            if (this.config.enableCSP) {
                this.setupCSP();
            }
            // Monitor for suspicious activity
            this.setupActivityMonitoring();
            // Clean up old rate limit entries periodically
            setInterval(() => this.cleanupRateLimits(), 60000);
            console.log('🔒 Security Manager initialized for Cloudflare Pages');
        }
    }
    // Validate API request before execution
    validateAPIRequest(endpoint, payload, apiKey) {
        if (!this.config.enableRequestValidation) {
            return { valid: true };
        }
        // Check rate limits
        if (this.config.enableRateLimit && this.isRateLimited('api_calls')) {
            this.logSecurityEvent('rate_limit', {
                endpoint,
                reason: 'API rate limit exceeded'
            }, 'medium');
            return { valid: false, reason: 'Rate limit exceeded. Please wait before making more requests.' };
        }
        // Validate payload structure
        if (!this.validatePayloadStructure(endpoint, payload)) {
            this.logSecurityEvent('invalid_request', {
                endpoint,
                payload: this.sanitizePayload(payload),
                reason: 'Invalid payload structure'
            }, 'medium');
            return { valid: false, reason: 'Invalid request payload structure.' };
        }
        // Check for potentially dangerous content
        if (this.containsSuspiciousContent(payload)) {
            this.logSecurityEvent('suspicious_activity', {
                endpoint,
                reason: 'Suspicious content detected'
            }, 'high');
            return { valid: false, reason: 'Request contains potentially harmful content.' };
        }
        // Update rate limit counter
        if (this.config.enableRateLimit) {
            this.updateRateLimit('api_calls');
        }
        return { valid: true };
    }
    // Sanitize API response before processing
    sanitizeAPIResponse(response, endpoint) {
        try {
            // Remove potentially dangerous fields
            const sanitized = this.deepClone(response);
            // Remove any script tags or executable content
            if (typeof sanitized === 'object') {
                this.recursivelyCleanObject(sanitized);
            }
            return sanitized;
        }
        catch (error) {
            this.logSecurityEvent('api_error', {
                endpoint,
                error: error instanceof Error ? error.message : 'Unknown error',
                reason: 'Response sanitization failed'
            }, 'medium');
            return null;
        }
    }
    // Protect sensitive data in browser storage
    protectStorageData(key, data) {
        try {
            // Simple obfuscation for client-side storage (not cryptographic security)
            const jsonString = JSON.stringify(data);
            const encoded = btoa(jsonString);
            // Add timestamp and checksum for integrity
            const protectedData = {
                data: encoded,
                timestamp: Date.now(),
                checksum: this.simpleChecksum(encoded)
            };
            return JSON.stringify(protectedData);
        }
        catch (error) {
            console.error('Failed to protect storage data:', error);
            return JSON.stringify(data);
        }
    }
    // Retrieve and validate protected storage data
    retrieveStorageData(key, protectedDataString) {
        try {
            const protectedData = JSON.parse(protectedDataString);
            // Validate checksum
            if (protectedData.checksum !== this.simpleChecksum(protectedData.data)) {
                this.logSecurityEvent('suspicious_activity', {
                    key,
                    reason: 'Storage data integrity check failed'
                }, 'high');
                return null;
            }
            // Check if data is too old (24 hours)
            if (Date.now() - protectedData.timestamp > 24 * 60 * 60 * 1000) {
                return null;
            }
            const decoded = atob(protectedData.data);
            return JSON.parse(decoded);
        }
        catch (error) {
            console.error('Failed to retrieve protected storage data:', error);
            return null;
        }
    }
    // Monitor for API budget limits
    checkBudgetLimits(service, estimatedCost) {
        const budgetLimits = {
            claude: { daily: 1.00, monthly: 30.00 },
            shotstack: { daily: 5.00, monthly: 150.00 },
            elevenlabs: { daily: 2.00, monthly: 60.00 }
        };
        const limit = budgetLimits[service];
        if (!limit)
            return { allowed: true };
        // Get current usage from storage
        const usage = this.getCurrentUsage(service);
        if (usage.daily + estimatedCost > limit.daily) {
            this.logSecurityEvent('rate_limit', {
                service,
                estimatedCost,
                currentUsage: usage.daily,
                limit: limit.daily,
                reason: 'Daily budget limit would be exceeded'
            }, 'medium');
            return {
                allowed: false,
                reason: `Daily budget limit for ${service} would be exceeded. Current: $${usage.daily.toFixed(2)}, Limit: $${limit.daily.toFixed(2)}`
            };
        }
        if (usage.monthly + estimatedCost > limit.monthly) {
            this.logSecurityEvent('rate_limit', {
                service,
                estimatedCost,
                currentUsage: usage.monthly,
                limit: limit.monthly,
                reason: 'Monthly budget limit would be exceeded'
            }, 'high');
            return {
                allowed: false,
                reason: `Monthly budget limit for ${service} would be exceeded. Current: $${usage.monthly.toFixed(2)}, Limit: $${limit.monthly.toFixed(2)}`
            };
        }
        return { allowed: true };
    }
    // Get security event log
    getSecurityEvents(limit = 100) {
        return this.securityEvents.slice(-limit);
    }
    // Subscribe to security events
    onSecurityEvent(callback) {
        this.listeners.push(callback);
        return () => {
            const index = this.listeners.indexOf(callback);
            if (index > -1)
                this.listeners.splice(index, 1);
        };
    }
    // Clear old security events
    clearOldEvents(olderThanMs = 24 * 60 * 60 * 1000) {
        const cutoff = Date.now() - olderThanMs;
        const initialLength = this.securityEvents.length;
        this.securityEvents = this.securityEvents.filter(event => event.timestamp > cutoff);
        return initialLength - this.securityEvents.length;
    }
    // Private: Setup Content Security Policy
    setupCSP() {
        if (typeof document !== 'undefined') {
            const meta = document.createElement('meta');
            meta.httpEquiv = 'Content-Security-Policy';
            meta.content = [
                "default-src 'self'",
                "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Next.js requires unsafe-eval
                "style-src 'self' 'unsafe-inline'",
                "img-src 'self' data: https:",
                "connect-src 'self' https://api.anthropic.com https://api.shotstack.io https://api.elevenlabs.io https://*.r2.cloudflarestorage.com",
                "frame-src 'none'",
                "object-src 'none'",
                "base-uri 'self'"
            ].join('; ');
            const existingCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
            if (existingCSP) {
                existingCSP.remove();
            }
            document.head.appendChild(meta);
        }
    }
    // Private: Setup activity monitoring
    setupActivityMonitoring() {
        if (typeof window !== 'undefined') {
            // Monitor for console access attempts
            const originalLog = console.log;
            console.log = (...args) => {
                if (args.some(arg => typeof arg === 'string' && arg.includes('API') && arg.includes('key'))) {
                    this.logSecurityEvent('suspicious_activity', {
                        reason: 'Potential API key exposure in console'
                    }, 'high');
                }
                originalLog.apply(console, args);
            };
            // Monitor for localStorage access to sensitive keys
            const originalSetItem = localStorage.setItem;
            localStorage.setItem = (key, value) => {
                if (key.toLowerCase().includes('api') || key.toLowerCase().includes('key')) {
                    this.logSecurityEvent('suspicious_activity', {
                        key,
                        reason: 'Attempt to store sensitive data in localStorage'
                    }, 'medium');
                }
                originalSetItem.call(localStorage, key, value);
            };
        }
    }
    // Private: Check rate limits
    isRateLimited(operation) {
        const now = Date.now();
        const windowMs = 60000; // 1 minute window
        const entry = this.rateLimitMap.get(operation);
        if (!entry)
            return false;
        // Reset window if expired
        if (now - entry.windowStart > windowMs) {
            entry.count = 0;
            entry.windowStart = now;
            entry.blocked = false;
        }
        return entry.blocked || entry.count >= this.config.maxAPICallsPerMinute;
    }
    // Private: Update rate limit counter
    updateRateLimit(operation) {
        const now = Date.now();
        const windowMs = 60000;
        let entry = this.rateLimitMap.get(operation);
        if (!entry) {
            entry = { count: 0, windowStart: now, blocked: false };
            this.rateLimitMap.set(operation, entry);
        }
        // Reset window if expired
        if (now - entry.windowStart > windowMs) {
            entry.count = 0;
            entry.windowStart = now;
            entry.blocked = false;
        }
        entry.count++;
        if (entry.count >= this.config.maxAPICallsPerMinute) {
            entry.blocked = true;
        }
    }
    // Private: Clean up old rate limit entries
    cleanupRateLimits() {
        const now = Date.now();
        const windowMs = 60000;
        for (const [operation, entry] of this.rateLimitMap.entries()) {
            if (now - entry.windowStart > windowMs * 2) {
                this.rateLimitMap.delete(operation);
            }
        }
    }
    // Private: Validate payload structure
    validatePayloadStructure(endpoint, payload) {
        if (!payload || typeof payload !== 'object')
            return false;
        // Define expected structures for different endpoints
        const schemas = {
            '/api/reddit-automation/generate-video': {
                required: ['story', 'background_url', 'voice_settings', 'video_config'],
                story: ['id', 'title', 'content', 'category'],
                voice_settings: ['voice_id'],
                video_config: ['duration', 'add_captions']
            },
            '/api/reddit-automation/scrape': {
                required: ['category', 'limit'],
            }
        };
        const schema = schemas[endpoint];
        if (!schema)
            return true; // Unknown endpoint, allow by default
        // Check required fields
        for (const field of schema.required) {
            if (!(field in payload))
                return false;
            // Check nested required fields
            if (schema[field] && typeof payload[field] === 'object') {
                const nestedRequired = schema[field];
                for (const nestedField of nestedRequired) {
                    if (!(nestedField in payload[field]))
                        return false;
                }
            }
        }
        return true;
    }
    // Private: Check for suspicious content
    containsSuspiciousContent(payload) {
        const suspiciousPatterns = [
            /<script/i,
            /javascript:/i,
            /data:text\/html/i,
            /eval\(/i,
            /function\s*\(/i,
            /onclick/i,
            /onload/i,
            /onerror/i
        ];
        const jsonString = JSON.stringify(payload);
        return suspiciousPatterns.some(pattern => pattern.test(jsonString));
    }
    // Private: Sanitize payload for logging
    sanitizePayload(payload) {
        const sanitized = this.deepClone(payload);
        // Remove sensitive fields
        const sensitiveFields = ['api_key', 'token', 'password', 'secret'];
        this.recursivelyRemoveFields(sanitized, sensitiveFields);
        return sanitized;
    }
    // Private: Recursively clean object
    recursivelyCleanObject(obj) {
        if (!obj || typeof obj !== 'object')
            return;
        for (const key in obj) {
            if (typeof obj[key] === 'string') {
                // Remove script tags and dangerous content
                obj[key] = obj[key]
                    .replace(/<script[^>]*>.*?<\/script>/gis, '')
                    .replace(/javascript:/gi, '')
                    .replace(/on\w+\s*=/gi, '');
            }
            else if (typeof obj[key] === 'object') {
                this.recursivelyCleanObject(obj[key]);
            }
        }
    }
    // Private: Recursively remove sensitive fields
    recursivelyRemoveFields(obj, fields) {
        if (!obj || typeof obj !== 'object')
            return;
        for (const field of fields) {
            if (field in obj) {
                obj[field] = '[REDACTED]';
            }
        }
        for (const key in obj) {
            if (typeof obj[key] === 'object') {
                this.recursivelyRemoveFields(obj[key], fields);
            }
        }
    }
    // Private: Deep clone object
    deepClone(obj) {
        if (obj === null || typeof obj !== 'object')
            return obj;
        if (obj instanceof Date)
            return new Date(obj.getTime());
        if (obj instanceof Array)
            return obj.map(item => this.deepClone(item));
        const cloned = {};
        for (const key in obj) {
            cloned[key] = this.deepClone(obj[key]);
        }
        return cloned;
    }
    // Private: Simple checksum for integrity
    simpleChecksum(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash;
    }
    // Private: Get current API usage
    getCurrentUsage(service) {
        try {
            const today = new Date().toDateString();
            const month = new Date().toISOString().slice(0, 7); // YYYY-MM
            const dailyKey = `usage_${service}_${today}`;
            const monthlyKey = `usage_${service}_${month}`;
            const daily = parseFloat(localStorage.getItem(dailyKey) || '0');
            const monthly = parseFloat(localStorage.getItem(monthlyKey) || '0');
            return { daily, monthly };
        }
        catch (error) {
            return { daily: 0, monthly: 0 };
        }
    }
    // Private: Log security event
    logSecurityEvent(type, details, severity) {
        if (!this.config.logSecurityEvents)
            return;
        const event = {
            type,
            timestamp: Date.now(),
            details,
            severity
        };
        this.securityEvents.push(event);
        // Keep only last 1000 events
        if (this.securityEvents.length > 1000) {
            this.securityEvents.shift();
        }
        // Notify listeners
        this.listeners.forEach(listener => listener(event));
        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
            console.warn(`🔒 Security Event [${severity}]:`, type, details);
        }
    }
}
exports.SecurityManager = SecurityManager;
// Singleton instance for global security management
let securityManagerInstance = null;
const getSecurityManager = () => {
    if (!securityManagerInstance) {
        securityManagerInstance = new SecurityManager();
    }
    return securityManagerInstance;
};
exports.getSecurityManager = getSecurityManager;
