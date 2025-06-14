#!/bin/bash

echo "🚀 Starting Cobalt with YouTube Cookie Support"

# Create cookies.json from environment variable if provided
if [ ! -z "$YOUTUBE_COOKIE_STRING" ]; then
    echo "🍪 Creating cookies.json from environment variable..."
    
    # Create the cookies.json file with proper format
    cat > /cookies.json << EOF
{
    "youtube": [
        "$YOUTUBE_COOKIE_STRING"
    ]
}
EOF
    
    echo "✅ Cookies file created at /cookies.json"
    echo "📍 Cookie path set to: $COOKIE_PATH"
else
    echo "⚠️  No YOUTUBE_COOKIE_STRING provided - YouTube authentication may fail"
fi

# Show environment info
echo "🔧 Environment Configuration:"
echo "   - COOKIE_PATH: $COOKIE_PATH"
echo "   - PORT: $PORT"
echo "   - YouTube Session Server: $YOUTUBE_SESSION_SERVER"
echo "   - YouTube Client: $YOUTUBE_SESSION_INNERTUBE_CLIENT"

echo "🎬 Starting Cobalt API server..."

# Start the original cobalt application
exec npm start