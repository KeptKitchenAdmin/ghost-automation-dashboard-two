# Fix Your Cobalt Instance on Render

## Problem
Your Cobalt instance returns `error.api.youtube.login` because YouTube blocks unauthenticated requests.

## Solution 1: Add Environment Variables (Quickest)

1. Go to your Render dashboard
2. Select your Cobalt service
3. Go to Environment tab
4. Add these variables:

```
YOUTUBE_SESSION_INNERTUBE_CLIENT=WEB
YOUTUBE_ALLOW_BETTER_AUDIO=1
API_AUTH_REQUIRED=0
JWT_SECRET=your-random-secret-here
```

4. Redeploy the service

## Solution 2: Redeploy with Fixed Configuration

### Docker Compose for Local Testing
```yaml
version: '3.8'
services:
  cobalt:
    image: imputnet/cobalt:latest
    ports:
      - "9000:9000"
    environment:
      - YOUTUBE_SESSION_INNERTUBE_CLIENT=WEB
      - YOUTUBE_ALLOW_BETTER_AUDIO=1
      - API_AUTH_REQUIRED=0
      - JWT_SECRET=supersecretkey123
```

### For Render Deployment
Use this GitHub repository setup:

**package.json:**
```json
{
  "name": "cobalt-youtube-fixed",
  "version": "1.0.0",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "@imputnet/cobalt-api": "latest"
  }
}
```

**server.js:**
```javascript
const { spawn } = require('child_process');

// Set environment variables
process.env.YOUTUBE_SESSION_INNERTUBE_CLIENT = 'WEB';
process.env.YOUTUBE_ALLOW_BETTER_AUDIO = '1';
process.env.API_AUTH_REQUIRED = '0';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret123';

// Start Cobalt
const cobalt = spawn('npx', ['@imputnet/cobalt-api'], {
  stdio: 'inherit',
  env: process.env
});

cobalt.on('close', (code) => {
  console.log(`Cobalt exited with code ${code}`);
  process.exit(code);
});
```

## Solution 3: Alternative - Use Different Hosting

If Render continues to have issues, deploy to:
- Railway
- Fly.io  
- DigitalOcean App Platform
- Heroku

## Test Your Fix

After applying the fix, test with:

```bash
curl -X POST "https://your-cobalt-instance.onrender.com/" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'
```

Should return a working download URL instead of login error.