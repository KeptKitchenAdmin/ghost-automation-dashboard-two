/**
 * Secure R2 Storage Manager with Pre-signed URLs and Anti-ban Protection
 * Enterprise-level security using Cloudflare R2 infrastructure
 */

import { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectCommand, GetObjectCommand, getSignedUrl } from "../mocks/aws-sdk";

interface ProxyRotation {
  proxies: (string | undefined)[];
  current: number;
}

interface RateLimit {
  requests: number;
  per_hour: boolean;
  last_reset: number;
  count: number;
}

interface RateLimits {
  [service: string]: RateLimit;
}

interface UploadResult {
  file_key: string;
  download_url: string;
  file_hash: string;
  upload_time: string;
}

interface StorageStats {
  file_count?: number;
  total_size?: number;
  total_size_mb?: number;
  bucket_name?: string;
  error?: string;
}

export class SecureR2Manager {
  private r2Client: S3Client | null = null;
  private r2AccessKey: string;
  private r2SecretKey: string;
  private r2Endpoint: string;
  private r2Bucket: string;

  private proxyRotation: ProxyRotation = {
    proxies: [
      process.env.PROXY_1,
      process.env.PROXY_2,
      process.env.PROXY_3
    ],
    current: 0
  };

  private rateLimits: RateLimits = {
    fastmoss: { requests: 10, per_hour: true, last_reset: 0, count: 0 },
    kolodata: { requests: 15, per_hour: true, last_reset: 0, count: 0 },
    openai: { requests: 50, per_hour: true, last_reset: 0, count: 0 }
  };

  private userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/120.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/120.0'
  ];

  constructor() {
    this.r2AccessKey = process.env.R2_ACCESS_KEY_ID || '';
    this.r2SecretKey = process.env.R2_SECRET_ACCESS_KEY || '';
    this.r2Endpoint = process.env.R2_ENDPOINT || '';
    this.r2Bucket = process.env.R2_BUCKET_NAME || 'ghosttrace-output';

    try {
      this.r2Client = new S3Client({
        endpoint: this.r2Endpoint,
        credentials: {
          accessKeyId: this.r2AccessKey,
          secretAccessKey: this.r2SecretKey,
        },
        region: 'auto',
      });
      console.log('Secure R2 client initialized');
    } catch (error) {
      this.r2Client = null;
      console.error(`R2 client initialization failed: ${error}`);
    }
  }

  async uploadVideoSecure(
    videoBuffer: Buffer,
    filename: string,
    metadata: Record<string, string> = {}
  ): Promise<UploadResult> {
    try {
      if (!this.r2Client) {
        throw new Error('R2 client not initialized');
      }

      // Generate secure filename with hash
      const crypto = await import('crypto');
      const fileHash = crypto.createHash('sha256').update(videoBuffer).digest('hex').substring(0, 16);
      const now = new Date();
      const datePath = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`;
      const secureFilename = `videos/${datePath}/${fileHash}_${filename}`;

      // Upload to R2
      const putCommand = new PutObjectCommand({
        Bucket: this.r2Bucket,
        Key: secureFilename,
        Body: videoBuffer,
        ContentType: 'video/mp4',
        Metadata: {
          upload_time: new Date().toISOString(),
          file_hash: fileHash,
          ...metadata
        }
      });

      await this.r2Client.send(putCommand);

      // Generate pre-signed URL (1 hour expiry)
      const presignedUrl = await this.getPresignedUrl(secureFilename, 3600);

      console.log(`Video uploaded securely: ${secureFilename}`);

      return {
        file_key: secureFilename,
        download_url: presignedUrl,
        file_hash: fileHash,
        upload_time: new Date().toISOString()
      };

    } catch (error) {
      console.error(`Secure video upload failed: ${error}`);
      throw error;
    }
  }

  async getPresignedUrl(fileKey: string, expiresIn: number = 3600): Promise<string> {
    try {
      if (!this.r2Client) {
        throw new Error('R2 client not initialized');
      }

      // Limit expiry to max 7 days for security
      const maxExpiry = 7 * 24 * 3600; // 7 days
      const limitedExpiresIn = Math.min(expiresIn, maxExpiry);

      const getCommand = new GetObjectCommand({
        Bucket: this.r2Bucket,
        Key: fileKey
      });

      const presignedUrl = await getSignedUrl(this.r2Client, getCommand, {
        expiresIn: limitedExpiresIn
      });

      return presignedUrl;

    } catch (error) {
      console.error(`Pre-signed URL generation failed: ${error}`);
      throw error;
    }
  }

  getNextProxy(): string | null {
    const proxies = this.proxyRotation.proxies.filter(p => p);
    if (proxies.length === 0) {
      return null;
    }

    this.proxyRotation.current = (this.proxyRotation.current + 1) % proxies.length;
    return proxies[this.proxyRotation.current] || null;
  }

  getRandomUserAgent(): string {
    return this.userAgents[Math.floor(Math.random() * this.userAgents.length)];
  }

  async checkRateLimit(service: string): Promise<boolean> {
    if (!(service in this.rateLimits)) {
      return true;
    }

    const limitConfig = this.rateLimits[service];
    const now = Date.now() / 1000;

    // Reset hourly counters
    if (now - limitConfig.last_reset > 3600) { // 1 hour
      limitConfig.count = 0;
      limitConfig.last_reset = now;
    }

    // Check if under limit
    if (limitConfig.count >= limitConfig.requests) {
      console.warn(`Rate limit exceeded for ${service}`);
      return false;
    }

    limitConfig.count += 1;
    return true;
  }

  async humanDelay(minSeconds: number = 15, maxSeconds: number = 45): Promise<void> {
    const delay = Math.random() * (maxSeconds - minSeconds) + minSeconds;
    console.debug(`Adding human delay: ${delay.toFixed(2)}s`);
    return new Promise(resolve => setTimeout(resolve, delay * 1000));
  }

  async safeExternalRequest<T>(
    service: string,
    requestFunc: (...args: any[]) => Promise<T>,
    ...args: any[]
  ): Promise<T> {
    // Check rate limit
    if (!(await this.checkRateLimit(service))) {
      throw new Error(`Rate limit exceeded for ${service}`);
    }

    // Add proxy if available
    const proxy = this.getNextProxy();
    const requestOptions = args[args.length - 1] || {};
    if (proxy) {
      requestOptions.proxy = proxy;
    }

    // Add random user agent
    if (!requestOptions.headers) {
      requestOptions.headers = {};
    }
    requestOptions.headers['User-Agent'] = this.getRandomUserAgent();

    // Add human delay
    await this.humanDelay();

    try {
      const result = await requestFunc(...args);
      console.log(`Safe request to ${service} completed`);
      return result;

    } catch (error) {
      console.error(`Safe request to ${service} failed: ${error}`);
      // Add longer delay on failure
      await this.humanDelay(30, 90);
      throw error;
    }
  }

  async cleanupExpiredFiles(maxAgeDays: number = 30): Promise<void> {
    try {
      if (!this.r2Client) {
        return;
      }

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - maxAgeDays);

      // List all objects
      const listCommand = new ListObjectsV2Command({
        Bucket: this.r2Bucket
      });

      const response = await this.r2Client.send(listCommand);

      if (!response.Contents) {
        return;
      }

      let deletedCount = 0;
      for (const obj of response.Contents) {
        if (obj.LastModified && obj.LastModified < cutoffDate && obj.Key) {
          const deleteCommand = new DeleteObjectCommand({
            Bucket: this.r2Bucket,
            Key: obj.Key
          });
          await this.r2Client.send(deleteCommand);
          deletedCount++;
        }
      }

      console.log(`Cleaned up ${deletedCount} expired files from R2`);

    } catch (error) {
      console.error(`File cleanup failed: ${error}`);
    }
  }

  async getStorageStats(): Promise<StorageStats> {
    try {
      if (!this.r2Client) {
        return { error: 'R2 client not available' };
      }

      const listCommand = new ListObjectsV2Command({
        Bucket: this.r2Bucket
      });

      const response = await this.r2Client.send(listCommand);

      if (!response.Contents) {
        return { file_count: 0, total_size: 0 };
      }

      const fileCount = response.Contents.length;
      const totalSize = response.Contents.reduce((sum: number, obj: any) => sum + (obj.Size || 0), 0);

      return {
        file_count: fileCount,
        total_size: totalSize,
        total_size_mb: Math.round((totalSize / (1024 * 1024)) * 100) / 100,
        bucket_name: this.r2Bucket
      };

    } catch (error) {
      console.error(`Storage stats failed: ${error}`);
      return { error: String(error) };
    }
  }
}

// Global instance
export const secureStorage = new SecureR2Manager();