export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';

// GhostMoss Product Discovery API endpoint for existing dashboard
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const category = searchParams.get('category');
    const minCommission = parseFloat(searchParams.get('minCommission') || '0');
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '999');
    const trendVelocity = searchParams.get('trendVelocity');

    // Mock GhostMoss intelligence data (will connect to real API later)
    const products = generateTrendingProducts(limit, {
      category,
      minCommission,
      maxPrice,
      trendVelocity
    });

    return NextResponse.json({
      success: true,
      data: products,
      meta: {
        total: products.length,
        filters: { category, minCommission, maxPrice, trendVelocity },
        lastUpdated: new Date().toISOString(),
        source: 'ghostmoss_intelligence'
      }
    });

  } catch (error) {
    console.error('GhostMoss products API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch trending products' },
      { status: 500 }
    );
  }
}

// POST endpoint for AI viral predictions
export async function POST(request: NextRequest) {
  try {
    const { productData } = await request.json();

    if (!productData) {
      return NextResponse.json(
        { success: false, error: 'Product data required' },
        { status: 400 }
      );
    }

    // AI viral prediction logic
    const prediction = calculateViralPotential(productData);

    return NextResponse.json({
      success: true,
      data: prediction,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Viral prediction API error:', error);
    return NextResponse.json(
      { success: false, error: 'Prediction failed' },
      { status: 500 }
    );
  }
}

// Generate trending products with GhostMoss intelligence
function generateTrendingProducts(limit: number, filters: any) {
  const categories = ['Beauty', 'Tech', 'Lifestyle', 'Fashion', 'Health', 'Home'];
  const trendVelocities = ['Low', 'Moderate', 'High', 'Explosive'];
  
  const baseProducts = [
    'LED Face Mask', 'Wireless Charger', 'Kitchen Organizer', 'Bluetooth Speaker',
    'Skincare Tool', 'Phone Stand', 'Coffee Maker', 'Fitness Tracker',
    'Hair Styling Tool', 'Car Accessories', 'Smart Home Device', 'Gaming Setup',
    'Beauty Blender', 'Portable Fan', 'Desk Organizer', 'Travel Accessories',
    'Phone Case', 'Workout Equipment', 'Kitchen Gadget', 'Tech Accessory'
  ];

  let products = Array.from({ length: limit }, (_, i) => {
    const name = baseProducts[i % baseProducts.length] + ` Pro ${i + 1}`;
    const price = Math.round((Math.random() * 99 + 1) * 100) / 100;
    const rating = Math.round((Math.random() * 1.5 + 3.5) * 10) / 10;
    const sales = Math.floor(Math.random() * 50000);
    const commission = Math.round((Math.random() * 40 + 10) * 100) / 100;
    const category = categories[Math.floor(Math.random() * categories.length)];
    const trendVelocity = trendVelocities[Math.floor(Math.random() * trendVelocities.length)];
    
    return {
      id: `gm_${Date.now()}_${i}`,
      name,
      price,
      commission,
      rating,
      sales,
      trendVelocity,
      category,
      viralPotential: calculateViralScore(price, rating, commission, sales),
      imageUrl: `https://picsum.photos/300/300?random=${i + 100}`,
      shopUrl: `https://shop.tiktok.com/product/gm_${i}`,
      lastUpdated: new Date().toISOString(),
      contentFriendly: Math.random() > 0.4,
      problemSolving: Math.random() > 0.6,
      aiInsights: {
        hook: generateContentHook(name),
        targetAudience: generateTargetAudience(category),
        bestTimes: ['7-9 AM', '6-8 PM', '9-11 PM'],
        competitorCount: Math.floor(Math.random() * 20 + 5)
      }
    };
  });

  // Apply filters
  if (filters.category) {
    products = products.filter(p => p.category === filters.category);
  }
  if (filters.minCommission > 0) {
    products = products.filter(p => p.commission >= filters.minCommission);
  }
  if (filters.maxPrice < 999) {
    products = products.filter(p => p.price <= filters.maxPrice);
  }
  if (filters.trendVelocity) {
    products = products.filter(p => p.trendVelocity === filters.trendVelocity);
  }

  return products.slice(0, limit);
}

// Calculate viral potential score
function calculateViralScore(price: number, rating: number, commission: number, sales: number): number {
  let score = 50;
  
  // Price factor (sweet spot $10-$50)
  if (price >= 10 && price <= 50) score += 20;
  else if (price < 10) score += 10;
  
  // Rating factor
  if (rating >= 4.5) score += 15;
  else if (rating >= 4.0) score += 10;
  
  // Commission factor
  if (commission >= 20) score += 10;
  else if (commission >= 15) score += 5;
  
  // Sales factor
  if (sales > 10000) score += 5;
  
  return Math.min(Math.round(score), 100);
}

// AI viral prediction for specific product
function calculateViralPotential(productData: any) {
  const viralScore = calculateViralScore(
    productData.price,
    productData.rating,
    productData.commission,
    productData.sales
  );

  const factors = [];
  if (productData.price >= 10 && productData.price <= 50) {
    factors.push('Optimal price point for TikTok audience');
  }
  if (productData.rating >= 4.5) {
    factors.push('Excellent customer reviews');
  }
  if (productData.commission >= 20) {
    factors.push('High commission attracts creators');
  }

  return {
    viralProbability: viralScore,
    confidenceScore: Math.round((viralScore / 100) * 90 + 10),
    prediction: viralScore > 70 ? 'High Viral Potential' : viralScore > 40 ? 'Moderate Potential' : 'Low Potential',
    factors: factors.length > 0 ? factors : ['Standard product metrics'],
    recommendations: generateRecommendations(viralScore),
    projectedRevenue: Math.round(productData.price * productData.commission / 100 * (viralScore * 10)),
    optimalPostingTimes: ['7-9 AM EST', '6-8 PM EST', '9-11 PM EST'],
    suggestedHashtags: generateHashtags(productData.category)
  };
}

// Generate content hooks for products
function generateContentHook(productName: string): string {
  const hooks = [
    `This ${productName} is about to go viral on TikTok...`,
    `I tested this ${productName} so you don't have to`,
    `The ${productName} that everyone's talking about`,
    `Why this ${productName} is flying off the shelves`,
    `This ${productName} changed my life (not clickbait)`
  ];
  
  return hooks[Math.floor(Math.random() * hooks.length)];
}

// Generate target audience
function generateTargetAudience(category: string): string {
  const audiences = {
    'Beauty': 'Women 18-35, beauty enthusiasts, skincare lovers',
    'Tech': 'Tech enthusiasts 20-40, early adopters, gadget lovers',
    'Lifestyle': 'Lifestyle content viewers 18-45, life hackers',
    'Fashion': 'Fashion-forward individuals 16-35, style conscious',
    'Health': 'Health-conscious individuals 25-50, fitness enthusiasts',
    'Home': 'Homeowners 25-55, organization enthusiasts'
  };
  
  return audiences[category as keyof typeof audiences] || 'General TikTok audience 18-35';
}

// Generate recommendations
function generateRecommendations(viralScore: number): string[] {
  if (viralScore > 70) {
    return [
      'Create content immediately - high viral potential',
      'Focus on multiple video angles',
      'Monitor competitors closely',
      'Scale ad spend if content performs well'
    ];
  } else if (viralScore > 40) {
    return [
      'Test with small batch of content first',
      'Focus on product benefits and problem-solving',
      'Target specific niche audiences',
      'Monitor performance before scaling'
    ];
  } else {
    return [
      'Consider higher-rated alternatives',
      'Look for products with better commission rates',
      'Focus on products in optimal price range ($10-$50)',
      'Research trending alternatives in this category'
    ];
  }
}

// Generate relevant hashtags
function generateHashtags(category: string): string[] {
  const hashtagMap = {
    'Beauty': ['#skincare', '#beauty', '#glowup', '#selfcare', '#skincareroutine'],
    'Tech': ['#tech', '#gadgets', '#innovation', '#techreview', '#musthat'],
    'Lifestyle': ['#lifestyle', '#lifehacks', '#productivity', '#organization', '#selfimprovement'],
    'Fashion': ['#fashion', '#style', '#outfit', '#ootd', '#fashiontrends'],
    'Health': ['#health', '#fitness', '#wellness', '#selfcare', '#healthtips'],
    'Home': ['#home', '#homedecor', '#organization', '#homeimprovement', '#interiordesign']
  };
  
  const baseTags = ['#tiktokshop', '#viral', '#fyp', '#trending', '#musthave'];
  const categoryTags = hashtagMap[category as keyof typeof hashtagMap] || ['#lifestyle', '#musthave'];
  
  return [...baseTags, ...categoryTags].slice(0, 8);
}