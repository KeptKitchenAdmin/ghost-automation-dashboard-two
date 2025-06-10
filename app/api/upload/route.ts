import { NextRequest, NextResponse } from 'next/server';
import { createR2Client, shouldUseR2Storage } from '../../../lib/r2-storage';

interface UploadResponse {
  success: boolean;
  url?: string;
  fileName?: string;
  size?: number;
  storage?: 'r2' | 'local';
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<UploadResponse>> {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'No file provided',
      }, { status: 400 });
    }

    console.log(`📁 Processing upload: ${file.name} (${file.size} bytes)`);

    // Check if we should use R2 storage for this file
    if (shouldUseR2Storage(file)) {
      console.log('📤 Using R2 storage for large file');
      
      const r2Client = createR2Client();
      if (!r2Client) {
        return NextResponse.json({
          success: false,
          error: 'R2 storage not configured',
        }, { status: 500 });
      }

      // Generate unique key for the file
      const timestamp = Date.now();
      const key = `uploads/${timestamp}-${file.name}`;

      const uploadResult = await r2Client.uploadFile(file, key, file.type);
      
      if (uploadResult.success) {
        return NextResponse.json({
          success: true,
          url: uploadResult.url,
          fileName: file.name,
          size: file.size,
          storage: 'r2',
        });
      } else {
        return NextResponse.json({
          success: false,
          error: uploadResult.error,
        }, { status: 500 });
      }
    } else {
      console.log('💾 Using local storage for small file');
      
      // For small files, we could still handle them locally
      // but since we're using static export, we'll redirect to R2 anyway
      const r2Client = createR2Client();
      if (r2Client) {
        const timestamp = Date.now();
        const key = `small-files/${timestamp}-${file.name}`;
        
        const uploadResult = await r2Client.uploadFile(file, key, file.type);
        
        if (uploadResult.success) {
          return NextResponse.json({
            success: true,
            url: uploadResult.url,
            fileName: file.name,
            size: file.size,
            storage: 'r2',
          });
        }
      }

      return NextResponse.json({
        success: false,
        error: 'Local storage not available in static export mode',
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Upload error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown upload error',
    }, { status: 500 });
  }
}

// Health check for upload endpoint
export async function GET(): Promise<NextResponse> {
  const r2Client = createR2Client();
  
  return NextResponse.json({
    success: true,
    status: 'File Upload API - R2 Storage Integration',
    features: [
      'Large file upload to Cloudflare R2',
      'Automatic storage decision based on file size',
      'Support for video, audio, and document files',
      'Direct R2 integration bypassing Pages size limits'
    ],
    r2_configured: !!r2Client,
    max_file_size: '25MB (redirected to R2 for large files)',
    supported_formats: [
      'Images: jpg, png, gif, webp',
      'Videos: mp4, webm, mov',
      'Audio: mp3, wav, m4a',
      'Documents: pdf, zip, rar'
    ],
    environment_variables_needed: [
      'CLOUDFLARE_ACCOUNT_ID',
      'R2_ACCESS_KEY_ID', 
      'R2_SECRET_ACCESS_KEY',
      'R2_BUCKET_NAME (optional, defaults to ghost-automation-assets)'
    ]
  });
}