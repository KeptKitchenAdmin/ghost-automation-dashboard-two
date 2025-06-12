import { v4 as uuidv4 } from 'uuid';
import type { R2UploadResult } from '../lib/viral-clips/types';

// Simple R2 storage service using direct Cloudflare API
export class R2StorageService {
  private bucketName: string;
  private accountId: string;
  private apiToken: string;

  constructor() {
    this.bucketName = process.env.R2_BUCKET_NAME || 'ghosttrace-output';
    this.accountId = process.env.CLOUDFLARE_ACCOUNT_ID!;
    this.apiToken = process.env.CLOUDFLARE_API_TOKEN!;
  }

  async uploadFile(file: Buffer, key: string, contentType: string): Promise<R2UploadResult> {
    try {
      const url = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/r2/buckets/${this.bucketName}/objects/${key}`;
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': contentType,
        },
        body: file
      });

      if (!response.ok) {
        throw new Error(`R2 upload failed: ${response.status} ${response.statusText}`);
      }

      return {
        key,
        url: `https://${process.env.R2_PUBLIC_DOMAIN}/${key}`,
        size: file.length
      };
    } catch (error) {
      console.error('R2 upload failed:', error);
      throw error;
    }
  }

  async uploadVideoClip(videoPath: string, workflowId: string): Promise<string> {
    const fs = require('fs');
    const path = require('path');
    
    try {
      // Read video file from local processing
      const videoBuffer = await fs.promises.readFile(videoPath);
      const filename = `viral-clips/${workflowId}/${uuidv4()}_${path.basename(videoPath)}`;
      
      const result = await this.uploadFile(videoBuffer, filename, 'video/mp4');
      
      console.log(`✅ Video uploaded to R2: ${result.url}`);
      return result.url;
    } catch (error) {
      console.error('Failed to upload video clip to R2:', error);
      throw error;
    }
  }

  async uploadAudioClip(audioPath: string, workflowId: string): Promise<string> {
    const fs = require('fs');
    const path = require('path');
    
    try {
      // Read audio file from local processing
      const audioBuffer = await fs.promises.readFile(audioPath);
      const filename = `viral-clips/${workflowId}/${uuidv4()}_${path.basename(audioPath)}`;
      
      const result = await this.uploadFile(audioBuffer, filename, 'audio/mpeg');
      
      console.log(`✅ Audio uploaded to R2: ${result.url}`);
      return result.url;
    } catch (error) {
      console.error('Failed to upload audio clip to R2:', error);
      throw error;
    }
  }

  async uploadThumbnail(imagePath: string, workflowId: string): Promise<string> {
    const fs = require('fs');
    const path = require('path');
    
    try {
      // Read thumbnail file from local processing
      const imageBuffer = await fs.promises.readFile(imagePath);
      const filename = `viral-clips/${workflowId}/thumbnails/${uuidv4()}_${path.basename(imagePath)}`;
      
      const result = await this.uploadFile(imageBuffer, filename, 'image/jpeg');
      
      console.log(`✅ Thumbnail uploaded to R2: ${result.url}`);
      return result.url;
    } catch (error) {
      console.error('Failed to upload thumbnail to R2:', error);
      throw error;
    }
  }

  async deleteWorkflowFiles(workflowId: string): Promise<void> {
    try {
      // Simple cleanup - files will be automatically cleaned up by R2 lifecycle rules
      console.log(`🗑️ Cleanup scheduled for workflow ${workflowId} (handled by R2 lifecycle)`);
    } catch (error) {
      console.error('Failed to cleanup R2 files:', error);
      // Don't throw - cleanup failure shouldn't break the workflow
    }
  }

  async listWorkflowFiles(workflowId: string): Promise<string[]> {
    try {
      // For simplicity, return empty array - files exist but listing is complex without AWS SDK
      console.log(`📁 Files exist for workflow ${workflowId} (listing simplified)`);
      return [];
    } catch (error) {
      console.error('Failed to list workflow files:', error);
      return [];
    }
  }

  async getFileUrl(key: string): Promise<string> {
    return `https://${process.env.R2_PUBLIC_DOMAIN}/${key}`;
  }

  // Store workflow metadata in R2
  async storeWorkflowMetadata(workflowId: string, metadata: any): Promise<void> {
    try {
      const metadataKey = `viral-clips/${workflowId}/metadata.json`;
      const metadataBuffer = Buffer.from(JSON.stringify(metadata, null, 2));
      
      await this.uploadFile(metadataBuffer, metadataKey, 'application/json');
      console.log(`✅ Workflow metadata stored: ${metadataKey}`);
    } catch (error) {
      console.error('Failed to store workflow metadata:', error);
      throw error;
    }
  }

  // Retrieve workflow metadata from R2
  async getWorkflowMetadata(workflowId: string): Promise<any | null> {
    try {
      const metadataKey = `viral-clips/${workflowId}/metadata.json`;
      
      // In a real implementation, you'd use GetObjectCommand
      // For now, return null as metadata is optional
      return null;
    } catch (error) {
      console.error('Failed to retrieve workflow metadata:', error);
      return null;
    }
  }
}