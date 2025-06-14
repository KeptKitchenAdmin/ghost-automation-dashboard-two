# YouTube Cookies Setup for Cobalt

## Your YouTube Cookies (JSON Format)

Add this as an environment variable in your Render dashboard:

**Variable Name:** `YOUTUBE_COOKIES_JSON`

**Variable Value:**
```json
{
  "youtube.com": {
    "LOGIN_INFO": "AFmmF2swRQIhAPxzp5O4m2lwXDbOo82Xt9S5J3P0fKaT4BnkQGyEW9LlAiBOz-MxpPgkWEIcXnCbvX9Iu6beAqF8eWUOyBG8gjMpYQ:QUQ3MjNmemtJbnYwSzF6SWU3Y1FlaHczV1Zha1c4Z0RyQWU0MG0xUFBiUE9SUmlvQUZCY0o0bEV2ZHBWLXhUTC1TR0FlTWhCRDRIX0RCdnNLSEd4bVVtcW1laWl1dHFvT2JJZFFQeHYwdGdaNnlIeW5FVjhQa3AyYURZQU9SVk9tVHZrWURPRmtJU1FyUlJGWnhFajBhT3VMa21HS0pCOXBR",
    "HSID": "Amvju463cZGiETL79",
    "SSID": "AxKTDpQRePuXR1b6q",
    "SID": "g.a000xgihXJpta0GUGVs3myfoMXpGpW6gnO5fWcmlif_OyFG2eGnxJqHye8tGEwQdzxdkwCGGnAACgYKAWESARYSFQHGX2MiEU7zq03f8hvN2DUyJy6rAhoVAUF8yKqZYAkcM0l_q85nn5ToXv5T0076",
    "APISID": "54GUIUMRRYPETKIH/AmgulcXnm85lkBKAK",
    "SAPISID": "BT639KTWbY6mwlLf/AkuBsAF-CEnldYNxi",
    "PREF": "tz=America.Los_Angeles&f4=4000000",
    "VISITOR_INFO1_LIVE": "h423uzzcFBc"
  }
}
```

## Render Setup Instructions

1. **Go to Render Dashboard**
2. **Select your Cobalt service**
3. **Go to Environment tab**
4. **Add new environment variable:**
   - Name: `YOUTUBE_COOKIES_JSON`
   - Value: [Copy the JSON above]
5. **Save Changes**
6. **Manual Deploy** to restart with cookies

## Alternative Format (if the above doesn't work)

Try this Netscape cookie format instead:

**Variable Name:** `YOUTUBE_COOKIES_NETSCAPE`

**Variable Value:**
```
# Netscape HTTP Cookie File
.youtube.com	TRUE	/	TRUE	0	LOGIN_INFO	AFmmF2swRQIhAPxzp5O4m2lwXDbOo82Xt9S5J3P0fKaT4BnkQGyEW9LlAiBOz-MxpPgkWEIcXnCbvX9Iu6beAqF8eWUOyBG8gjMpYQ:QUQ3MjNmemtJbnYwSzF6SWU3Y1FlaHczV1Zha1c4Z0RyQWU0MG0xUFBiUE9SUmlvQUZCY0o0bEV2ZHBWLXhUTC1TR0FlTWhCRDRIX0RCdnNLSEd4bVVtcW1laWl1dHFvT2JJZFFQeHYwdGdaNnlIeW5FVjhQa3AyYURZQU9SVk9tVHZrWURPRmtJU1FyUlJGWnhFajBhT3VMa21HS0pCOXBR
.youtube.com	TRUE	/	FALSE	0	HSID	Amvju463cZGiETL79
.youtube.com	TRUE	/	TRUE	0	SSID	AxKTDpQRePuXR1b6q
.youtube.com	TRUE	/	TRUE	0	SID	g.a000xgihXJpta0GUGVs3myfoMXpGpW6gnO5fWcmlif_OyFG2eGnxJqHye8tGEwQdzxdkwCGGnAACgYKAWESARYSFQHGX2MiEU7zq03f8hvN2DUyJy6rAhoVAUF8yKqZYAkcM0l_q85nn5ToXv5T0076
.youtube.com	TRUE	/	TRUE	0	APISID	54GUIUMRRYPETKIH/AmgulcXnm85lkBKAK
.youtube.com	TRUE	/	TRUE	0	SAPISID	BT639KTWbY6mwlLf/AkuBsAF-CEnldYNxi
.youtube.com	TRUE	/	FALSE	0	PREF	tz=America.Los_Angeles&f4=4000000
.youtube.com	TRUE	/	FALSE	0	VISITOR_INFO1_LIVE	h423uzzcFBc
```

## Testing After Setup

After adding cookies and redeploying, test with:

```bash
curl -X POST "https://cobalt-latest-qymt.onrender.com/" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'
```

Should return `"status": "tunnel"` with a working URL instead of login error.