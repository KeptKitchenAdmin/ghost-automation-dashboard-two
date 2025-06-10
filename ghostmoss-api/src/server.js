const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const WebSocket = require('ws');
const http = require('http');
const Redis = require('ioredis');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Redis client for rate limiting and caching (optional for development)
let redis = null;
try {
  redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    retryDelayOnFailover: 100,
    enableReadyCheck: false,
    maxRetriesPerRequest: 1,
  });
} catch (error) {
  console.log('⚠️  Redis not available - using in-memory rate limiting');
}

// Security middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'https://ghost-automation-dashboard-two.wren-fc5.workers.dev'],
  credentials: true
}));

// Rate limiting based on API tier
const createRateLimit = (tier) => {
  const limits = {
    free: { windowMs: 15 * 60 * 1000, max: 25 }, // 25 requests per 15 minutes
    pro: { windowMs: 15 * 60 * 1000, max: 250 }, // 250 requests per 15 minutes
    business: { windowMs: 15 * 60 * 1000, max: 1250 }, // 1250 requests per 15 minutes
    enterprise: { windowMs: 15 * 60 * 1000, max: 10000 } // 10k requests per 15 minutes
  };
  
  return rateLimit({
    windowMs: limits[tier].windowMs,
    max: limits[tier].max,
    message: `Rate limit exceeded for ${tier} tier`,
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// GraphQL Schema - The heart of our API
const schema = buildSchema(`
  type Product {
    id: String!
    name: String!
    price: Float!
    commission: Float!
    rating: Float!
    sales: Int!
    trendVelocity: String!
    viralPotential: Float!
    imageUrl: String
    shopUrl: String
    category: String!
    lastUpdated: String!
  }

  type Creator {
    id: String!
    username: String!
    followers: Int!
    engagementRate: Float!
    authenticityScore: Float!
    niches: [String!]!
    avgViews: Int!
    contactEmail: String
    collaborationScore: Float!
  }

  type TrendPrediction {
    productId: String!
    viralProbability: Float!
    peakDate: String
    projectedSales: Int!
    confidenceScore: Float!
    trendFactors: [String!]!
  }

  type Competitor {
    brand: String!
    productCount: Int!
    marketShare: Float!
    avgCommission: Float!
    topProducts: [Product!]!
    strategy: String!
  }

  type ProductFilters {
    commissionMin: Float
    commissionMax: Float
    priceMin: Float
    priceMax: Float
    ratingMin: Float
    salesMax: Int
    trendVelocity: String
    problemSolving: Boolean
    contentFriendly: Boolean
  }

  type CreatorFilters {
    followersMin: Int
    followersMax: Int
    engagementRateMin: Float
    authenticityScoreMin: Float
    niches: [String!]
  }

  type Query {
    # Product Discovery
    trendingProducts(limit: Int = 50, filters: String): [Product!]!
    productById(id: String!): Product
    productAnalytics(id: String!): TrendPrediction
    
    # Creator Intelligence
    topCreators(limit: Int = 50, filters: String): [Creator!]!
    creatorById(id: String!): Creator
    creatorOpportunities(productId: String!): [Creator!]!
    
    # Competitive Intelligence
    competitors(category: String): [Competitor!]!
    marketAnalysis(category: String!): [Product!]!
    
    # AI Predictions
    predictTrends(timeframe: String = "7d"): [TrendPrediction!]!
    viralPotential(productId: String!): Float!
    
    # Real-time Data
    liveMetrics: String!
    platformStatus: String!
  }

  type Mutation {
    # Product Monitoring
    monitorProduct(productId: String!): Boolean!
    stopMonitoring(productId: String!): Boolean!
    
    # Alert System
    createAlert(type: String!, criteria: String!): Boolean!
    
    # User Management
    upgradeSubscription(tier: String!): Boolean!
  }

  type Subscription {
    # Real-time updates
    productTrendUpdates: Product!
    newViralProducts: Product!
    competitorAlerts: String!
    priceChanges: Product!
  }
`);

// Mock data generators (will be replaced with real scraping)
const generateMockProducts = () => {
  const categories = ['Beauty', 'Tech', 'Lifestyle', 'Fashion', 'Health', 'Home'];
  const trendVelocities = ['Low', 'Moderate', 'High', 'Explosive'];
  
  return Array.from({ length: 100 }, (_, i) => ({
    id: `prod_${i + 1}`,
    name: `Trending Product ${i + 1}`,
    price: Math.round((Math.random() * 99 + 1) * 100) / 100,
    commission: Math.round((Math.random() * 40 + 10) * 100) / 100,
    rating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10,
    sales: Math.floor(Math.random() * 50000),
    trendVelocity: trendVelocities[Math.floor(Math.random() * trendVelocities.length)],
    viralPotential: Math.round(Math.random() * 100),
    imageUrl: `https://picsum.photos/300/300?random=${i}`,
    shopUrl: `https://tiktokshop.com/product/${i}`,
    category: categories[Math.floor(Math.random() * categories.length)],
    lastUpdated: new Date().toISOString()
  }));
};

const generateMockCreators = () => {
  const niches = ['Beauty', 'Tech', 'Comedy', 'Fashion', 'Fitness', 'Food'];
  
  return Array.from({ length: 50 }, (_, i) => ({
    id: `creator_${i + 1}`,
    username: `@tiktoker${i + 1}`,
    followers: Math.floor(Math.random() * 1000000 + 1000),
    engagementRate: Math.round((Math.random() * 8 + 2) * 100) / 100,
    authenticityScore: Math.round((Math.random() * 30 + 70) * 100) / 100,
    niches: [niches[Math.floor(Math.random() * niches.length)]],
    avgViews: Math.floor(Math.random() * 500000 + 10000),
    contactEmail: `creator${i + 1}@email.com`,
    collaborationScore: Math.round(Math.random() * 100)
  }));
};

// Resolvers - Business logic for our API
const root = {
  // Product Discovery
  trendingProducts: ({ limit = 50, filters }) => {
    let products = generateMockProducts();
    
    if (filters) {
      try {
        const filterObj = JSON.parse(filters);
        products = products.filter(product => {
          if (filterObj.commissionMin && product.commission < filterObj.commissionMin) return false;
          if (filterObj.commissionMax && product.commission > filterObj.commissionMax) return false;
          if (filterObj.priceMin && product.price < filterObj.priceMin) return false;
          if (filterObj.priceMax && product.price > filterObj.priceMax) return false;
          if (filterObj.ratingMin && product.rating < filterObj.ratingMin) return false;
          if (filterObj.salesMax && product.sales > filterObj.salesMax) return false;
          if (filterObj.trendVelocity && product.trendVelocity !== filterObj.trendVelocity) return false;
          return true;
        });
      } catch (e) {
        console.log('Invalid filter JSON:', e);
      }
    }
    
    return products.slice(0, limit);
  },

  productById: ({ id }) => {
    const products = generateMockProducts();
    return products.find(p => p.id === id) || null;
  },

  productAnalytics: ({ id }) => ({
    productId: id,
    viralProbability: Math.round(Math.random() * 100),
    peakDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    projectedSales: Math.floor(Math.random() * 100000 + 10000),
    confidenceScore: Math.round((Math.random() * 30 + 70) * 100) / 100,
    trendFactors: ['High engagement rate', 'Celebrity endorsement', 'Seasonal demand']
  }),

  // Creator Intelligence
  topCreators: ({ limit = 50, filters }) => {
    let creators = generateMockCreators();
    
    if (filters) {
      try {
        const filterObj = JSON.parse(filters);
        creators = creators.filter(creator => {
          if (filterObj.followersMin && creator.followers < filterObj.followersMin) return false;
          if (filterObj.followersMax && creator.followers > filterObj.followersMax) return false;
          if (filterObj.engagementRateMin && creator.engagementRate < filterObj.engagementRateMin) return false;
          if (filterObj.authenticityScoreMin && creator.authenticityScore < filterObj.authenticityScoreMin) return false;
          return true;
        });
      } catch (e) {
        console.log('Invalid filter JSON:', e);
      }
    }
    
    return creators.slice(0, limit);
  },

  creatorById: ({ id }) => {
    const creators = generateMockCreators();
    return creators.find(c => c.id === id) || null;
  },

  creatorOpportunities: ({ productId }) => {
    return generateMockCreators().slice(0, 10); // Top 10 creators for this product
  },

  // Competitive Intelligence
  competitors: ({ category }) => [
    {
      brand: 'FastMoss',
      productCount: 15420,
      marketShare: 23.5,
      avgCommission: 18.2,
      topProducts: generateMockProducts().slice(0, 5),
      strategy: 'High-volume, low-commission strategy'
    },
    {
      brand: 'Kalodata',
      productCount: 8900,
      marketShare: 15.3,
      avgCommission: 22.8,
      topProducts: generateMockProducts().slice(5, 10),
      strategy: 'Premium products, higher margins'
    }
  ],

  marketAnalysis: ({ category }) => {
    return generateMockProducts().filter(p => p.category === category).slice(0, 20);
  },

  // AI Predictions
  predictTrends: ({ timeframe }) => {
    return Array.from({ length: 10 }, (_, i) => ({
      productId: `prod_${i + 1}`,
      viralProbability: Math.round((Math.random() * 50 + 50) * 100) / 100,
      peakDate: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      projectedSales: Math.floor(Math.random() * 200000 + 50000),
      confidenceScore: Math.round((Math.random() * 20 + 80) * 100) / 100,
      trendFactors: ['Rising search volume', 'Influencer adoption', 'Seasonal trend']
    }));
  },

  viralPotential: ({ productId }) => {
    return Math.round((Math.random() * 40 + 60) * 100) / 100; // 60-100% for high potential
  },

  // Real-time data
  liveMetrics: () => JSON.stringify({
    totalProducts: 156420,
    activeCreators: 89750,
    avgCommission: 19.3,
    topCategory: 'Beauty',
    trendingNow: 'Skincare Tools'
  }),

  platformStatus: () => 'Operational - 99.9% uptime',

  // Mutations
  monitorProduct: ({ productId }) => {
    console.log(`Monitoring product: ${productId}`);
    return true;
  },

  stopMonitoring: ({ productId }) => {
    console.log(`Stopped monitoring product: ${productId}`);
    return true;
  },

  createAlert: ({ type, criteria }) => {
    console.log(`Created alert: ${type} with criteria: ${criteria}`);
    return true;
  },

  upgradeSubscription: ({ tier }) => {
    console.log(`Upgraded to: ${tier}`);
    return true;
  }
};

// API tier detection middleware
const detectApiTier = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.query.apiKey;
  
  if (!apiKey) {
    req.apiTier = 'free';
  } else {
    // In production, lookup tier from database
    // For now, simple prefix detection
    if (apiKey.startsWith('gm_enterprise_')) {
      req.apiTier = 'enterprise';
    } else if (apiKey.startsWith('gm_business_')) {
      req.apiTier = 'business';
    } else if (apiKey.startsWith('gm_pro_')) {
      req.apiTier = 'pro';
    } else {
      req.apiTier = 'free';
    }
  }
  
  next();
};

// Apply rate limiting based on detected tier
app.use('/graphql', detectApiTier, (req, res, next) => {
  const limiter = createRateLimit(req.apiTier);
  limiter(req, res, next);
});

// GraphQL endpoint
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: process.env.NODE_ENV === 'development',
}));

// REST API endpoints for easier integration
app.get('/api/products/trending', detectApiTier, createRateLimit('free'), (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  const filters = req.query.filters;
  const products = root.trendingProducts({ limit, filters });
  res.json({ data: products, meta: { tier: req.apiTier, count: products.length } });
});

app.get('/api/creators/top', detectApiTier, createRateLimit('free'), (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  const filters = req.query.filters;
  const creators = root.topCreators({ limit, filters });
  res.json({ data: creators, meta: { tier: req.apiTier, count: creators.length } });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    uptime: process.uptime() 
  });
});

// WebSocket connections for real-time updates
wss.on('connection', (ws) => {
  console.log('New WebSocket connection');
  
  // Send welcome message
  ws.send(JSON.stringify({
    type: 'connection',
    message: 'Connected to GhostMoss real-time intelligence'
  }));

  // Simulate real-time product updates
  const interval = setInterval(() => {
    const randomProduct = generateMockProducts()[0];
    ws.send(JSON.stringify({
      type: 'product_update',
      data: randomProduct
    }));
  }, 10000); // Every 10 seconds

  ws.on('close', () => {
    clearInterval(interval);
    console.log('WebSocket connection closed');
  });
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`🚀 GhostMoss API Server running on port ${PORT}`);
  console.log(`📊 GraphQL endpoint: http://localhost:${PORT}/graphql`);
  console.log(`🔌 WebSocket server: ws://localhost:${PORT}`);
  console.log(`💡 API Health: http://localhost:${PORT}/api/health`);
});