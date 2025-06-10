export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (url.pathname === '/api/generate-images' && request.method === 'POST') {
      try {
        const { contentType, topic } = await request.json();

        if (!env.OPENAI_API_KEY) {
          return new Response(JSON.stringify({
            success: false,
            error: 'OpenAI API key not configured'
          }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        let imagePrompts = [];

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

        const images = [];

        // Generate images sequentially to avoid rate limits
        for (const prompt of imagePrompts) {
          try {
            const response = await fetch('https://api.openai.com/v1/images/generations', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                model: 'dall-e-3',
                prompt: prompt,
                size: '1024x1024',
                quality: 'hd',
                n: 1,
              })
            });

            if (response.ok) {
              const result = await response.json();
              if (result.data && result.data[0]?.url) {
                images.push(result.data[0].url);
              }
            }
          } catch (error) {
            console.error('Error generating individual image:', error);
            // Continue with other images even if one fails
          }
        }

        if (images.length === 0) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Failed to generate any images'
          }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        return new Response(JSON.stringify({
          success: true,
          images,
          count: images.length,
          usage: 'Document images for viral conspiracy content'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      } catch (error) {
        console.error('Image generation failed:', error);
        return new Response(JSON.stringify({
          success: false,
          error: 'Image generation failed',
          details: error.message
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    return new Response('Not found', { 
      status: 404,
      headers: corsHeaders 
    });
  },
};