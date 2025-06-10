const axios = require('axios');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const { RateLimiter } = require('limiter');

class TikTokShopScraper {
  constructor() {
    // Rate limiting: 100 requests per minute to avoid being blocked
    this.limiter = new RateLimiter(100, 'minute');
    this.browser = null;
    this.page = null;
  }

  async initialize() {
    this.browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    this.page = await this.browser.newPage();
    
    // Set realistic headers to avoid detection
    await this.page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    await this.page.setViewport({ width: 1920, height: 1080 });
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  // Main method to scrape trending products
  async scrapeTrendingProducts(limit = 50) {
    await this.limiter.removeTokens(1);
    
    try {
      if (!this.page) await this.initialize();

      const products = [];
      
      // Multiple TikTok Shop pages to scrape
      const pages = [
        'https://shop.tiktok.com/discover',
        'https://shop.tiktok.com/trending',
        'https://shop.tiktok.com/categories/beauty',
        'https://shop.tiktok.com/categories/electronics'
      ];

      for (const url of pages) {
        if (products.length >= limit) break;
        
        try {
          console.log(`Scraping: ${url}`);
          await this.page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
          
          // Wait for products to load
          await this.page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 });
          
          const pageProducts = await this.page.evaluate(() => {
            const productElements = document.querySelectorAll('[data-testid="product-card"]');
            return Array.from(productElements).map(element => {
              const name = element.querySelector('h3')?.textContent?.trim() || 'Unknown Product';
              const priceText = element.querySelector('[data-testid="price"]')?.textContent?.trim() || '0';
              const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
              const imageUrl = element.querySelector('img')?.src || '';
              const productUrl = element.querySelector('a')?.href || '';
              const rating = parseFloat(element.querySelector('[data-testid="rating"]')?.textContent?.trim() || '0');
              const soldText = element.querySelector('[data-testid="sold"]')?.textContent?.trim() || '0';
              const sales = parseInt(soldText.replace(/[^0-9]/g, '')) || 0;
              
              return {
                name,
                price,
                imageUrl,
                productUrl,
                rating,
                sales,
                source: 'tiktok_shop'
              };
            });
          });

          products.push(...pageProducts);
          
          // Random delay between pages to avoid detection
          await this.randomDelay(2000, 5000);
          
        } catch (error) {
          console.error(`Error scraping ${url}:`, error.message);
          continue;
        }
      }

      return this.enrichProductData(products.slice(0, limit));
      
    } catch (error) {
      console.error('TikTok Shop scraping failed:', error);
      return this.generateFallbackData(limit);
    }
  }

  // Enrich product data with calculated metrics
  enrichProductData(products) {
    return products.map((product, index) => {
      const commission = this.calculateCommission(product.price, product.rating);
      const trendVelocity = this.calculateTrendVelocity(product.sales, product.rating);
      const viralPotential = this.calculateViralPotential(product);
      const category = this.detectCategory(product.name);

      return {
        id: `tiktok_${Date.now()}_${index}`,
        name: product.name,
        price: product.price,
        commission: commission,
        rating: product.rating || 4.5,
        sales: product.sales || 0,
        trendVelocity: trendVelocity,
        viralPotential: viralPotential,
        imageUrl: product.imageUrl || `https://picsum.photos/300/300?random=${index}`,
        shopUrl: product.productUrl || `https://shop.tiktok.com/product/${index}`,
        category: category,
        lastUpdated: new Date().toISOString(),
        source: product.source,
        contentFriendly: this.isContentFriendly(product.name),
        problemSolving: this.isProblemSolving(product.name)
      };
    });
  }

  // Calculate commission rate based on price and performance
  calculateCommission(price, rating) {
    let baseCommission = 15; // Base 15%
    
    // Higher commission for lower priced items (easier to sell)
    if (price < 25) baseCommission += 10;
    else if (price < 50) baseCommission += 5;
    
    // Bonus for high rated products
    if (rating >= 4.5) baseCommission += 5;
    else if (rating >= 4.0) baseCommission += 2;
    
    return Math.min(Math.round(baseCommission * 100) / 100, 50); // Cap at 50%
  }

  // Determine trend velocity based on sales and rating
  calculateTrendVelocity(sales, rating) {
    const score = (sales / 1000) + (rating * 20);
    
    if (score > 100) return 'Explosive';
    if (score > 50) return 'High';
    if (score > 20) return 'Moderate';
    return 'Low';
  }

  // Calculate viral potential score
  calculateViralPotential(product) {
    let score = 50; // Base score
    
    // Price factor (sweet spot $10-$50)
    if (product.price >= 10 && product.price <= 50) score += 20;
    else if (product.price < 10) score += 10;
    
    // Rating factor
    if (product.rating >= 4.5) score += 15;
    else if (product.rating >= 4.0) score += 10;
    
    // Sales factor
    if (product.sales > 10000) score += 15;
    else if (product.sales > 1000) score += 10;
    
    return Math.min(Math.round(score), 100);
  }

  // Detect product category from name
  detectCategory(name) {
    const categories = {
      'Beauty': ['skincare', 'makeup', 'beauty', 'cosmetic', 'serum', 'cream', 'mask'],
      'Tech': ['phone', 'charger', 'bluetooth', 'wireless', 'gadget', 'electronic'],
      'Fashion': ['clothing', 'shirt', 'dress', 'shoes', 'jewelry', 'accessory'],
      'Health': ['vitamin', 'supplement', 'fitness', 'health', 'wellness'],
      'Home': ['kitchen', 'home', 'decor', 'cleaning', 'organization'],
      'Lifestyle': ['toy', 'game', 'book', 'hobby', 'entertainment']
    };

    const nameLower = name.toLowerCase();
    
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => nameLower.includes(keyword))) {
        return category;
      }
    }
    
    return 'Lifestyle'; // Default category
  }

  // Check if product is content-friendly for TikTok
  isContentFriendly(name) {
    const friendlyKeywords = [
      'beauty', 'skincare', 'gadget', 'tool', 'kitchen', 'organization',
      'fitness', 'home', 'tech', 'accessory', 'creative'
    ];
    
    const nameLower = name.toLowerCase();
    return friendlyKeywords.some(keyword => nameLower.includes(keyword));
  }

  // Check if product solves a problem (higher conversion)
  isProblemSolving(name) {
    const problemKeywords = [
      'cleaner', 'organizer', 'solution', 'remover', 'protector',
      'holder', 'storage', 'saver', 'helper', 'tool'
    ];
    
    const nameLower = name.toLowerCase();
    return problemKeywords.some(keyword => nameLower.includes(keyword));
  }

  // Fallback data when scraping fails
  generateFallbackData(limit) {
    console.log('Using fallback data due to scraping failure');
    
    const categories = ['Beauty', 'Tech', 'Lifestyle', 'Fashion', 'Health', 'Home'];
    const trendVelocities = ['Low', 'Moderate', 'High', 'Explosive'];
    const productNames = [
      'LED Face Mask', 'Wireless Charger', 'Kitchen Organizer', 'Bluetooth Speaker',
      'Skincare Tool', 'Phone Stand', 'Coffee Maker', 'Fitness Tracker',
      'Hair Styling Tool', 'Car Accessories', 'Home Decor', 'Gaming Setup'
    ];
    
    return Array.from({ length: limit }, (_, i) => {
      const name = productNames[i % productNames.length] + ` ${i + 1}`;
      const price = Math.round((Math.random() * 99 + 1) * 100) / 100;
      const rating = Math.round((Math.random() * 1.5 + 3.5) * 10) / 10;
      const sales = Math.floor(Math.random() * 50000);
      
      return {
        id: `fallback_${Date.now()}_${i}`,
        name: name,
        price: price,
        commission: this.calculateCommission(price, rating),
        rating: rating,
        sales: sales,
        trendVelocity: trendVelocities[Math.floor(Math.random() * trendVelocities.length)],
        viralPotential: this.calculateViralPotential({ price, rating, sales }),
        imageUrl: `https://picsum.photos/300/300?random=${i}`,
        shopUrl: `https://shop.tiktok.com/product/fallback_${i}`,
        category: categories[Math.floor(Math.random() * categories.length)],
        lastUpdated: new Date().toISOString(),
        source: 'fallback',
        contentFriendly: Math.random() > 0.5,
        problemSolving: Math.random() > 0.6
      };
    });
  }

  // Random delay helper
  async randomDelay(min, max) {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  // Get competitor product data
  async scrapeCompetitorProducts(source = 'amazon') {
    await this.limiter.removeTokens(1);
    
    // Placeholder for competitor scraping
    // In production, this would scrape Amazon, AliExpress, etc.
    console.log(`Scraping competitor data from: ${source}`);
    
    return this.generateFallbackData(20);
  }

  // Monitor specific product for price/trend changes
  async monitorProduct(productId) {
    console.log(`Monitoring product: ${productId}`);
    
    // In production, this would:
    // 1. Track price changes
    // 2. Monitor trend velocity
    // 3. Alert on significant changes
    // 4. Update database with new data
    
    return {
      productId,
      monitored: true,
      lastCheck: new Date().toISOString(),
      changes: []
    };
  }
}

module.exports = TikTokShopScraper;