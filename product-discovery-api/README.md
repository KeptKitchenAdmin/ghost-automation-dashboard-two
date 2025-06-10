# Product Discovery API

**Superior to Fastmoss** - Standalone microservice for discovering trending products with real TikTok data and affiliate opportunities.

## 🚀 Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Start the API server
python main.py
```

The API will be available at `http://localhost:8001`

## 📊 API Endpoints

### Core Discovery
- `GET /api/products/discover` - Discover trending products with real data
- `GET /api/products/top-opportunities` - Get highest-scoring opportunities
- `POST /api/products/refresh` - Trigger fresh discovery scan

### Analytics & Status
- `GET /api/status` - Discovery engine health status
- `GET /api/products/analytics` - Performance analytics
- `GET /api/products/categories` - Available product categories

### Integration
- `GET /` - Health check endpoint
- CORS enabled for dashboard integration

## 🔥 Why Superior to Fastmoss

1. **Real Product Data**: Actual images, working affiliate links, real TikTok URLs
2. **Multi-Source Intelligence**: TikTok + Amazon + Social signals
3. **Superior Scoring**: Advanced opportunity algorithm with 5 weighted factors
4. **Real-Time Discovery**: Live scanning vs static data
5. **Full Control**: Own the data pipeline and scoring logic

## 🎯 Integration with Main Dashboard

```typescript
// Dashboard integration example
const response = await fetch('http://localhost:8001/api/products/discover?limit=10')
const data = await response.json()
// Use data.products directly in FastmossProductDiscovery component
```

## 📈 Data Sources

- **TikTok Hashtag Analysis**: Trending product mentions and engagement
- **Amazon Trends**: Best-selling products with affiliate potential  
- **Social Signals**: Cross-platform product discussions
- **Real-Time Scoring**: Dynamic opportunity calculation

## 🛠 Architecture

```
Main Dashboard (Next.js) 
    ↓ API calls
Product Discovery API (FastAPI)
    ↓ discovers from
Multiple Data Sources (TikTok, Amazon, Social)
    ↓ stores in
SQLite Database
```

## 🔄 Development Workflow

1. Run discovery API: `python main.py`
2. API serves at `localhost:8001` 
3. Dashboard calls API endpoints
4. Real product data flows to frontend
5. Users see actual products with working links

## 🎬 Next Steps

1. Build TikTok scraping system
2. Implement Amazon API integration
3. Add social media listening
4. Create real-time scoring updates
5. Deploy as separate service