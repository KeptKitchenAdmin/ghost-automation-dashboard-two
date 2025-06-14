# Cobalt YouTube Cookies Docker Image

Custom Docker image for Cobalt that supports YouTube authentication via environment variables.

## What This Solves

- **Problem**: Official Cobalt Docker image expects `cookies.json` file to exist
- **Solution**: This image creates `cookies.json` from environment variables at startup

## Environment Variables

### Required
- `YOUTUBE_COOKIE_STRING`: Your YouTube cookies formatted as a single string

### Optional  
- `COOKIE_PATH`: Path to cookies file (default: `/cookies.json`)
- `PORT`: Port to run on (default: `9000`)
- `YOUTUBE_SESSION_SERVER`: YouTube session server URL
- `YOUTUBE_SESSION_INNERTUBE_CLIENT`: InnerTube client type

## Cookie Format

The `YOUTUBE_COOKIE_STRING` should be formatted like:
```
LOGIN_INFO=value; HSID=value; SSID=value; SID=value; APISID=value; SAPISID=value; PREF=value; VISITOR_INFO1_LIVE=value
```

## Usage

### Docker Run
```bash
docker run -p 9000:9000 \
  -e YOUTUBE_COOKIE_STRING="your-cookie-string-here" \
  your-registry/cobalt-youtube-cookies:latest
```

### Docker Compose
```yaml
version: '3.8'
services:
  cobalt:
    image: your-registry/cobalt-youtube-cookies:latest
    ports:
      - "9000:9000"
    environment:
      - YOUTUBE_COOKIE_STRING=your-cookie-string-here
      - COOKIE_PATH=/cookies.json
```

### Render Deployment

1. Connect this repository to Render
2. Set up environment variables:
   - `YOUTUBE_COOKIE_STRING`: Your cookie string
3. Deploy!

## Testing

After deployment, test with:
```bash
curl -X POST "https://your-instance.com/" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'
```

Should return `"status": "tunnel"` with working proxy URL.

## Troubleshooting

Check logs for:
- `✅ Cookies file created at /cookies.json` - confirms cookies are loaded
- `⚠️ No YOUTUBE_COOKIE_STRING provided` - missing environment variable
- YouTube authentication errors - cookies may have expired