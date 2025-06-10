/**
 * Pixel Tracking & UTM Builder Module
 * Handles web pixel tracking and UTM parameter generation
 */

interface PixelData {
  pixel_id: string;
  campaign_id: string;
  source: string;
  created_at: string;
  events: PixelEvent[];
}

interface PixelEvent {
  event_type: string;
  timestamp: string;
  data: Record<string, any>;
}

interface PixelAnalytics {
  pixel_id: string;
  campaign_id?: string;
  total_events: number;
  unique_visitors: number;
  page_views: number;
  clicks: number;
  conversions: number;
  created_at?: string;
  last_activity?: string;
  source?: string;
  click_through_rate?: number;
  conversion_rate?: number;
  error?: string;
}

interface UTMParams {
  utm_campaign: string;
  utm_source: string;
  utm_medium: string;
  utm_id: string;
  utm_content?: string;
  utm_term?: string;
}

interface CampaignData {
  campaign_id: string;
  campaign_name: string;
  base_url: string;
  tagged_url: string;
  utm_params: UTMParams;
  created_at: string;
  clicks: number;
  conversions: number;
  last_click?: string;
  click_data?: Array<{
    timestamp: string;
    user_data: Record<string, any>;
  }>;
}

interface UTMResult {
  campaign_id: string;
  tagged_url: string;
  utm_params: UTMParams;
}

interface UTMAnalytics {
  total_campaigns?: number;
  campaigns?: Array<{
    campaign_id: string;
    campaign_name: string;
    clicks: number;
    conversions: number;
    created_at: string;
  }>;
  error?: string;
  campaign_id?: string;
  campaign_name?: string;
  clicks?: number;
  conversions?: number;
  created_at?: string;
}

export class PixelTracker {
  private tiktok_pixel_id?: string;
  private facebook_pixel_id?: string;
  private google_analytics_id?: string;

  constructor() {
    this.tiktok_pixel_id = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;
    this.facebook_pixel_id = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
    this.google_analytics_id = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;
  }

  async generateTrackingPixel(campaign_id: string, source: string = 'tiktok'): Promise<string> {
    const pixel_id = this.generateUUID();
    
    // Store pixel mapping via API
    const pixel_data: PixelData = {
      pixel_id,
      campaign_id,
      source,
      created_at: new Date().toISOString(),
      events: []
    };
    
    try {
      await fetch('/api/pixel/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pixel_data),
      });
    } catch (error) {
      console.error('Failed to save pixel data:', error);
    }
    
    // Generate pixel HTML based on platform
    if (source === 'tiktok' && this.tiktok_pixel_id) {
      return this.generateTikTokPixel(pixel_id);
    } else if (source === 'facebook' && this.facebook_pixel_id) {
      return this.generateFacebookPixel(pixel_id);
    } else if (source === 'google' && this.google_analytics_id) {
      return this.generateGooglePixel(pixel_id);
    } else {
      return this.generateCustomPixel(pixel_id);
    }
  }

  private generateTikTokPixel(pixel_id: string): string {
    return `
<!-- TikTok Pixel Code -->
<script>
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
  ttq.load('${this.tiktok_pixel_id}');
  ttq.page();
}(window, document, 'ttq');

// Custom tracking for our system
ttq.track('PageView', {
  'pixel_id': '${pixel_id}',
  'timestamp': new Date().toISOString()
});
</script>
<!-- End TikTok Pixel Code -->

<!-- Custom Tracking Pixel -->
<img src="/api/pixel/track/${pixel_id}?event=page_view&timestamp=" + new Date().getTime() width="1" height="1" style="display:none;" />
`;
  }

  private generateFacebookPixel(pixel_id: string): string {
    return `
<!-- Facebook Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${this.facebook_pixel_id}');
fbq('track', 'PageView', {
  'pixel_id': '${pixel_id}'
});
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=${this.facebook_pixel_id}&ev=PageView&noscript=1"
/></noscript>
<!-- End Facebook Pixel Code -->

<!-- Custom Tracking Pixel -->
<img src="/api/pixel/track/${pixel_id}?event=page_view&timestamp=" + new Date().getTime() width="1" height="1" style="display:none;" />
`;
  }

  private generateGooglePixel(pixel_id: string): string {
    return `
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${this.google_analytics_id}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${this.google_analytics_id}', {
    'custom_map': {'custom_pixel_id': '${pixel_id}'}
  });
  
  // Track custom event
  gtag('event', 'page_view', {
    'event_category': 'engagement',
    'event_label': '${pixel_id}',
    'custom_pixel_id': '${pixel_id}'
  });
</script>

<!-- Custom Tracking Pixel -->
<img src="/api/pixel/track/${pixel_id}?event=page_view&timestamp=" + new Date().getTime() width="1" height="1" style="display:none;" />
`;
  }

  private generateCustomPixel(pixel_id: string): string {
    return `
<!-- Custom Tracking Pixel -->
<script>
(function() {
  // Track page view
  var img = new Image();
  img.src = '/api/pixel/track/${pixel_id}?event=page_view&timestamp=' + new Date().getTime();
  
  // Track user engagement
  document.addEventListener('click', function(e) {
    var clickImg = new Image();
    clickImg.src = '/api/pixel/track/${pixel_id}?event=click&element=' + e.target.tagName + '&timestamp=' + new Date().getTime();
  });
  
  // Track time on page
  var startTime = new Date().getTime();
  window.addEventListener('beforeunload', function() {
    var timeOnPage = new Date().getTime() - startTime;
    var timeImg = new Image();
    timeImg.src = '/api/pixel/track/${pixel_id}?event=time_on_page&duration=' + timeOnPage + '&timestamp=' + new Date().getTime();
  });
})();
</script>
<noscript><img src="/api/pixel/track/${pixel_id}?event=page_view&timestamp=" + new Date().getTime() width="1" height="1" style="display:none;" /></noscript>
`;
  }

  async trackEvent(pixel_id: string, event_type: string, event_data?: Record<string, any>): Promise<boolean> {
    try {
      const response = await fetch('/api/pixel/track-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pixel_id,
          event_type,
          event_data: event_data || {},
          timestamp: new Date().toISOString()
        }),
      });

      if (response.ok) {
        console.log(`Tracked ${event_type} for pixel ${pixel_id}`);
        return true;
      } else {
        console.error(`Failed to track event: ${response.statusText}`);
        return false;
      }
      
    } catch (error) {
      console.error(`Failed to track event for pixel ${pixel_id}:`, error);
      return false;
    }
  }

  async getPixelAnalytics(pixel_id: string): Promise<PixelAnalytics> {
    try {
      const response = await fetch(`/api/pixel/analytics/${pixel_id}`);
      
      if (response.ok) {
        return await response.json();
      } else {
        return { 
          pixel_id, 
          total_events: 0, 
          unique_visitors: 0, 
          page_views: 0, 
          clicks: 0, 
          conversions: 0,
          error: 'Pixel not found' 
        };
      }
      
    } catch (error) {
      console.error(`Failed to get analytics for pixel ${pixel_id}:`, error);
      return { 
        pixel_id, 
        total_events: 0, 
        unique_visitors: 0, 
        page_views: 0, 
        clicks: 0, 
        conversions: 0,
        error: String(error) 
      };
    }
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

export class UTMBuilder {
  constructor() {}

  async generateUTMLink(
    base_url: string,
    campaign_name: string,
    source: string,
    medium: string,
    content?: string,
    term?: string
  ): Promise<UTMResult> {
    // Generate campaign ID
    const campaign_id = await this.generateCampaignId(campaign_name, source, medium);
    
    // Build UTM parameters
    const utm_params: UTMParams = {
      utm_campaign: campaign_name,
      utm_source: source,
      utm_medium: medium,
      utm_id: campaign_id
    };
    
    if (content) {
      utm_params.utm_content = content;
    }
    if (term) {
      utm_params.utm_term = term;
    }
    
    // Create tagged URL
    const utm_string = new URLSearchParams(utm_params as any).toString();
    const separator = base_url.includes('?') ? '&' : '?';
    const tagged_url = `${base_url}${separator}${utm_string}`;
    
    // Store campaign data via API
    const campaign_data: CampaignData = {
      campaign_id,
      campaign_name,
      base_url,
      tagged_url,
      utm_params,
      created_at: new Date().toISOString(),
      clicks: 0,
      conversions: 0
    };
    
    try {
      await fetch('/api/utm/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(campaign_data),
      });
    } catch (error) {
      console.error('Failed to save campaign data:', error);
    }
    
    return {
      campaign_id,
      tagged_url,
      utm_params
    };
  }

  async trackUTMClick(campaign_id: string, user_data?: Record<string, any>): Promise<boolean> {
    try {
      const response = await fetch('/api/utm/track-click', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campaign_id,
          user_data: user_data || {},
          timestamp: new Date().toISOString()
        }),
      });

      if (response.ok) {
        console.log(`Tracked click for UTM campaign ${campaign_id}`);
        return true;
      } else {
        console.error(`Failed to track UTM click: ${response.statusText}`);
        return false;
      }
      
    } catch (error) {
      console.error(`Failed to track UTM click for ${campaign_id}:`, error);
      return false;
    }
  }

  async getUTMAnalytics(campaign_id?: string): Promise<UTMAnalytics> {
    try {
      const url = campaign_id ? `/api/utm/analytics/${campaign_id}` : '/api/utm/analytics';
      const response = await fetch(url);
      
      if (response.ok) {
        return await response.json();
      } else {
        return { error: 'Failed to get analytics' };
      }
      
    } catch (error) {
      console.error('Failed to get UTM analytics:', error);
      return { error: String(error) };
    }
  }

  private async generateCampaignId(campaign_name: string, source: string, medium: string): Promise<string> {
    const input = `${campaign_name}_${source}_${medium}_${Date.now()}`;
    
    // Use Web Crypto API for hashing in browser
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      const encoder = new TextEncoder();
      const data = encoder.encode(input);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return hashHex.substring(0, 8);
    } else {
      // Fallback for server-side or older browsers
      let hash = 0;
      for (let i = 0; i < input.length; i++) {
        const char = input.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
      }
      return Math.abs(hash).toString(16).substring(0, 8);
    }
  }

  // Utility method to parse UTM parameters from URL
  parseUTMFromURL(url: string): Partial<UTMParams> {
    try {
      const urlObj = new URL(url);
      const params = urlObj.searchParams;
      
      return {
        utm_campaign: params.get('utm_campaign') || undefined,
        utm_source: params.get('utm_source') || undefined,
        utm_medium: params.get('utm_medium') || undefined,
        utm_content: params.get('utm_content') || undefined,
        utm_term: params.get('utm_term') || undefined,
        utm_id: params.get('utm_id') || undefined
      };
    } catch (error) {
      console.error('Failed to parse UTM from URL:', error);
      return {};
    }
  }

  // Method to track UTM parameters from current page
  trackCurrentPageUTM(): Partial<UTMParams> | null {
    if (typeof window === 'undefined') return null;
    
    const utm_params = this.parseUTMFromURL(window.location.href);
    
    // Store UTM data in session storage for attribution
    if (Object.keys(utm_params).length > 0) {
      try {
        sessionStorage.setItem('utm_attribution', JSON.stringify(utm_params));
        
        // Track the click if we have a campaign ID
        if (utm_params.utm_id) {
          this.trackUTMClick(utm_params.utm_id, {
            referrer: document.referrer,
            user_agent: navigator.userAgent,
            timestamp: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error('Failed to store UTM attribution:', error);
      }
    }
    
    return utm_params;
  }

  // Get stored UTM attribution data
  getStoredUTMAttribution(): Partial<UTMParams> | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const stored = sessionStorage.getItem('utm_attribution');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to get stored UTM attribution:', error);
      return null;
    }
  }
}

// Test functions
export async function testPixelTracking(): Promise<boolean> {
  const tracker = new PixelTracker();
  
  // Generate tracking pixel
  const pixel_html = await tracker.generateTrackingPixel('test_campaign', 'tiktok');
  console.log("Generated tracking pixel HTML");
  
  // Extract pixel ID from HTML (for testing)
  const pixel_match = pixel_html.match(/\/api\/pixel\/track\/([^?]+)/);
  if (pixel_match) {
    const pixel_id = pixel_match[1];
    
    // Track some events
    await tracker.trackEvent(pixel_id, 'page_view', { user_id: 'test_user_1' });
    await tracker.trackEvent(pixel_id, 'click', { element: 'button' });
    await tracker.trackEvent(pixel_id, 'conversion', { value: 99 });
    
    // Get analytics
    const analytics = await tracker.getPixelAnalytics(pixel_id);
    console.log('Pixel analytics:', analytics);
  }
  
  return true;
}

export async function testUTMBuilder(): Promise<boolean> {
  const utm_builder = new UTMBuilder();
  
  // Generate UTM link
  const utm_result = await utm_builder.generateUTMLink(
    'https://yoursite.com/landing',
    'tiktok_viral_q4',
    'tiktok',
    'video',
    'luxury_lifestyle',
    'premium_services'
  );
  
  console.log('Generated UTM link:', utm_result);
  
  // Track some clicks
  const campaign_id = utm_result.campaign_id;
  await utm_builder.trackUTMClick(campaign_id, { referrer: 'tiktok.com', device: 'mobile' });
  await utm_builder.trackUTMClick(campaign_id, { referrer: 'tiktok.com', device: 'desktop' });
  
  // Get analytics
  const analytics = await utm_builder.getUTMAnalytics(campaign_id);
  console.log('UTM analytics:', analytics);
  
  return true;
}

// Export instances
export const pixelTracker = new PixelTracker();
export const utmBuilder = new UTMBuilder();