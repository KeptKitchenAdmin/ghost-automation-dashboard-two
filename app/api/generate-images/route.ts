
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    const { contentType, topic } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    let imagePrompts: string[] = [];

    if (contentType === 'viral-growth-conspiracy') {
      if (topic === 'mkultra' || !topic) {
        imagePrompts = [
          "Vintage 1950s government document with 'TOP SECRET - MKUltra' header, typewriter font, official CIA letterhead, redacted sections with black bars, aged paper texture, authentic government seal, photorealistic",
          "Declassified document showing human experiment data, charts with psychological test results, clinical notes about mind control subjects, official government stamps, yellowed paper, documentary style",
          "Medical experiment report with subject numbers, psychological evaluation charts, handwritten notes in margins, 'CLASSIFIED - EYES ONLY' watermark, authentic vintage document style"
        ];
      } else if (topic === 'nutrition') {
        imagePrompts = [
          "1960s sugar industry internal memo revealing lobby tactics, corporate letterhead, charts showing hidden payments to scientists, aged business document style, photorealistic",
          "Government nutrition study results showing BMI fraud, statistical charts proving BMI inaccuracy, official health department letterhead, scientific data tables",
          "FDA internal document discussing industry influence, meeting notes about suppressed studies, official government formatting, highlighted key sections"
        ];
      }
    }

    const images: string[] = [];

    // Generate images sequentially to avoid rate limits
    for (const prompt of imagePrompts) {
      try {
        const response = await openai.images.generate({
          model: "dall-e-3",
          prompt: prompt,
          size: "1024x1024",
          quality: "hd",
          n: 1,
        });

        if (response.data && response.data[0]?.url) {
          images.push(response.data[0].url);
        }
      } catch (error) {
        console.error('Error generating individual image:', error);
        // Continue with other images even if one fails
      }
    }

    if (images.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Failed to generate any images' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      images,
      count: images.length,
      usage: 'Document images for viral conspiracy content'
    });

  } catch (error) {
    console.error('Image generation failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Image generation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}