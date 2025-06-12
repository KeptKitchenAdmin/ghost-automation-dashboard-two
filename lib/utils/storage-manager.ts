/**
 * Storage Manager for Reddit Video Automation
 * Handles video file storage (local and cloud) with automatic cleanup
 */

import { promises as fs } from 'fs';
import path from 'path';

export interface StorageConfig {
  useCloudStorage: boolean;
  localStoragePath: string;
  maxFileAge: number; // in hours
  maxStorageSize: number; // in MB
}

export interface StoredFile {
  id: string;
  originalName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  createdAt: string;
  expiresAt: string;
}

export class StorageManager {
  private config: StorageConfig;
  private readonly DEFAULT_CONFIG: StorageConfig = {
    useCloudStorage: false,
    localStoragePath: './output/reddit-videos',
    maxFileAge: 24, // 24 hours
    maxStorageSize: 500 // 500MB
  };

  constructor(config?: Partial<StorageConfig>) {
    this.config = { ...this.DEFAULT_CONFIG, ...config };
    this.initializeStorage();
  }

  /**
   * Initialize storage directories
   */
  private async initializeStorage(): Promise<void> {
    try {
      await fs.mkdir(this.config.localStoragePath, { recursive: true });
      await fs.mkdir(path.join(this.config.localStoragePath, 'videos'), { recursive: true });
      await fs.mkdir(path.join(this.config.localStoragePath, 'audio'), { recursive: true });
      await fs.mkdir(path.join(this.config.localStoragePath, 'temp'), { recursive: true });
      
      console.log('✅ Storage directories initialized');
    } catch (error) {
      console.error('❌ Failed to initialize storage:', error);
    }
  }

  /**
   * Store a video file
   */
  async storeVideo(fileBuffer: Buffer, originalName: string, mimeType: string = 'video/mp4'): Promise<StoredFile> {
    const fileId = this.generateFileId();
    const fileName = `${fileId}.mp4`;
    const filePath = path.join(this.config.localStoragePath, 'videos', fileName);
    
    try {
      await fs.writeFile(filePath, fileBuffer);
      
      const storedFile: StoredFile = {
        id: fileId,
        originalName,
        filePath,
        fileSize: fileBuffer.length,
        mimeType,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + this.config.maxFileAge * 60 * 60 * 1000).toISOString()
      };

      await this.saveFileMetadata(storedFile);
      console.log(`✅ Video stored: ${fileName} (${this.formatFileSize(fileBuffer.length)})`);
      
      return storedFile;
    } catch (error) {
      console.error('❌ Failed to store video:', error);
      throw error;
    }
  }

  /**
   * Store an audio file
   */
  async storeAudio(fileBuffer: Buffer, originalName: string, mimeType: string = 'audio/mp3'): Promise<StoredFile> {
    const fileId = this.generateFileId();
    const fileName = `${fileId}.mp3`;
    const filePath = path.join(this.config.localStoragePath, 'audio', fileName);
    
    try {
      await fs.writeFile(filePath, fileBuffer);
      
      const storedFile: StoredFile = {
        id: fileId,
        originalName,
        filePath,
        fileSize: fileBuffer.length,
        mimeType,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + this.config.maxFileAge * 60 * 60 * 1000).toISOString()
      };

      await this.saveFileMetadata(storedFile);
      console.log(`✅ Audio stored: ${fileName} (${this.formatFileSize(fileBuffer.length)})`);
      
      return storedFile;
    } catch (error) {
      console.error('❌ Failed to store audio:', error);
      throw error;
    }
  }

  /**
   * Get file by ID
   */
  async getFile(fileId: string): Promise<StoredFile | null> {
    try {
      const metadataPath = path.join(this.config.localStoragePath, 'temp', `${fileId}.json`);
      const metadata = await fs.readFile(metadataPath, 'utf-8');
      return JSON.parse(metadata) as StoredFile;
    } catch (error) {
      return null;
    }
  }

  /**
   * Get file buffer
   */
  async getFileBuffer(fileId: string): Promise<Buffer | null> {
    try {
      const file = await this.getFile(fileId);
      if (!file) return null;
      
      return await fs.readFile(file.filePath);
    } catch (error) {
      console.error('❌ Failed to read file:', error);
      return null;
    }
  }

  /**
   * Delete file
   */
  async deleteFile(fileId: string): Promise<boolean> {
    try {
      const file = await this.getFile(fileId);
      if (!file) return false;
      
      // Delete the actual file
      await fs.unlink(file.filePath);
      
      // Delete metadata
      const metadataPath = path.join(this.config.localStoragePath, 'temp', `${fileId}.json`);
      await fs.unlink(metadataPath);
      
      console.log(`✅ File deleted: ${fileId}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to delete file:', error);
      return false;
    }
  }

  /**
   * Clean up expired files
   */
  async cleanupExpiredFiles(): Promise<number> {
    try {
      const tempDir = path.join(this.config.localStoragePath, 'temp');
      const metadataFiles = await fs.readdir(tempDir);
      
      let deletedCount = 0;
      const now = new Date();
      
      for (const metadataFile of metadataFiles) {
        if (!metadataFile.endsWith('.json')) continue;
        
        try {
          const metadataPath = path.join(tempDir, metadataFile);
          const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf-8')) as StoredFile;
          
          if (new Date(metadata.expiresAt) < now) {
            await this.deleteFile(metadata.id);
            deletedCount++;
          }
        } catch (error) {
          console.warn(`⚠️ Failed to process metadata file: ${metadataFile}`);
        }
      }
      
      if (deletedCount > 0) {
        console.log(`✅ Cleaned up ${deletedCount} expired files`);
      }
      
      return deletedCount;
    } catch (error) {
      console.error('❌ Failed to cleanup expired files:', error);
      return 0;
    }
  }

  /**
   * Get storage statistics
   */
  async getStorageStats(): Promise<{
    totalFiles: number;
    totalSize: number;
    videoCount: number;
    audioCount: number;
    oldestFile: string | null;
    newestFile: string | null;
  }> {
    try {
      const tempDir = path.join(this.config.localStoragePath, 'temp');
      const metadataFiles = await fs.readdir(tempDir);
      
      let totalSize = 0;
      let videoCount = 0;
      let audioCount = 0;
      let oldestDate = new Date();
      let newestDate = new Date(0);
      let oldestFile = null;
      let newestFile = null;
      
      for (const metadataFile of metadataFiles) {
        if (!metadataFile.endsWith('.json')) continue;
        
        try {
          const metadataPath = path.join(tempDir, metadataFile);
          const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf-8')) as StoredFile;
          
          totalSize += metadata.fileSize;
          
          if (metadata.mimeType.startsWith('video/')) videoCount++;
          if (metadata.mimeType.startsWith('audio/')) audioCount++;
          
          const createdDate = new Date(metadata.createdAt);
          if (createdDate < oldestDate) {
            oldestDate = createdDate;
            oldestFile = metadata.originalName;
          }
          if (createdDate > newestDate) {
            newestDate = createdDate;
            newestFile = metadata.originalName;
          }
        } catch (error) {
          console.warn(`⚠️ Failed to process metadata file: ${metadataFile}`);
        }
      }
      
      return {
        totalFiles: metadataFiles.length,
        totalSize,
        videoCount,
        audioCount,
        oldestFile,
        newestFile
      };
    } catch (error) {
      console.error('❌ Failed to get storage stats:', error);
      return {
        totalFiles: 0,
        totalSize: 0,
        videoCount: 0,
        audioCount: 0,
        oldestFile: null,
        newestFile: null
      };
    }
  }

  /**
   * Private helper methods
   */
  private generateFileId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async saveFileMetadata(file: StoredFile): Promise<void> {
    const metadataPath = path.join(this.config.localStoragePath, 'temp', `${file.id}.json`);
    await fs.writeFile(metadataPath, JSON.stringify(file, null, 2));
  }

  private formatFileSize(bytes: number): string {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  }
}

// Export singleton instance
export const storageManager = new StorageManager();