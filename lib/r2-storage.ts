// Cloudflare R2 Storage Integration
// For handling large assets and uploads outside of Pages deployment

export interface R2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  region?: string;
}

export class R2StorageClient {
  private config: R2Config;
  private baseUrl: string;

  constructor(config: R2Config) {
    this.config = config;
    this.baseUrl = `https://${config.bucketName}.${config.accountId}.r2.cloudflarestorage.com`;
  }

  /**
   * Upload a file to R2 storage
   */
  async uploadFile(
    file: File | Buffer,
    key: string,
    contentType?: string
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      const formData = new FormData();
      
      if (file instanceof File) {
        formData.append('file', file);
        contentType = contentType || file.type;
      } else {
        // Handle Buffer
        formData.append('file', new Blob([file], { type: contentType }));
      }

      const response = await fetch(`${this.baseUrl}/${key}`, {
        method: 'PUT',
        headers: {
          'Authorization': this.getAuthHeader(),
          'Content-Type': contentType || 'application/octet-stream',
        },
        body: file,
      });

      if (response.ok) {
        return {
          success: true,
          url: `${this.baseUrl}/${key}`,
        };
      } else {
        return {
          success: false,
          error: `Upload failed: ${response.statusText}`,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Generate a presigned URL for direct uploads
   */
  async getPresignedUploadUrl(
    key: string,
    contentType: string,
    expiresIn: number = 3600
  ): Promise<{ success: boolean; uploadUrl?: string; error?: string }> {
    try {
      // Generate presigned URL using R2 API
      const response = await fetch(`${this.baseUrl}/presign`, {
        method: 'POST',
        headers: {
          'Authorization': this.getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key,
          contentType,
          expiresIn,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          uploadUrl: data.uploadUrl,
        };
      } else {
        return {
          success: false,
          error: `Presigned URL generation failed: ${response.statusText}`,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Delete a file from R2 storage
   */
  async deleteFile(key: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/${key}`, {
        method: 'DELETE',
        headers: {
          'Authorization': this.getAuthHeader(),
        },
      });

      if (response.ok) {
        return { success: true };
      } else {
        return {
          success: false,
          error: `Delete failed: ${response.statusText}`,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get public URL for a file
   */
  getPublicUrl(key: string): string {
    return `${this.baseUrl}/${key}`;
  }

  /**
   * List files in the bucket
   */
  async listFiles(prefix?: string): Promise<{ success: boolean; files?: string[]; error?: string }> {
    try {
      const url = new URL(`${this.baseUrl}/`);
      if (prefix) {
        url.searchParams.set('prefix', prefix);
      }

      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': this.getAuthHeader(),
        },
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          files: data.files || [],
        };
      } else {
        return {
          success: false,
          error: `List failed: ${response.statusText}`,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private getAuthHeader(): string {
    // This would typically use AWS signature v4 for R2
    // For now, using basic auth format
    const credentials = Buffer.from(
      `${this.config.accessKeyId}:${this.config.secretAccessKey}`
    ).toString('base64');
    return `Basic ${credentials}`;
  }
}

// Factory function to create R2 client with environment variables
export function createR2Client(): R2StorageClient | null {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.R2_BUCKET_NAME || 'ghosttrace-output';

  if (!accountId || !accessKeyId || !secretAccessKey) {
    console.warn('R2 credentials not found in environment variables');
    return null;
  }

  return new R2StorageClient({
    accountId,
    accessKeyId,
    secretAccessKey,
    bucketName,
  });
}

// Helper function to determine if a file should use R2 storage
export function shouldUseR2Storage(file: File): boolean {
  const maxSizeForPages = 25 * 1024 * 1024; // 25MB Cloudflare Pages limit
  const largeFileTypes = [
    'video/',
    'audio/',
    'application/pdf',
    'application/zip',
    'application/x-rar',
  ];

  // Use R2 for files over 10MB or specific large file types
  return (
    file.size > 10 * 1024 * 1024 ||
    largeFileTypes.some(type => file.type.startsWith(type))
  );
}

export default { R2StorageClient, createR2Client, shouldUseR2Storage };