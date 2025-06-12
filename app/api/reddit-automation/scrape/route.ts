import { NextResponse } from 'next/server';
import { RedditScraperService } from '../../../../lib/services/reddit-scraper';

export async function POST(request: Request) {
  try {
    const { category, limit = 15 } = await request.json();
    
    console.log(`🔍 API: Scraping Reddit stories for category: ${category}`);
    
    if (!category) {
      return NextResponse.json({ 
        success: false, 
        error: 'Category is required' 
      }, { status: 400 });
    }

    const validCategories = ['drama', 'horror', 'revenge', 'wholesome', 'mystery'];
    if (!validCategories.includes(category)) {
      return NextResponse.json({ 
        success: false, 
        error: `Invalid category. Must be one of: ${validCategories.join(', ')}` 
      }, { status: 400 });
    }

    const scraper = new RedditScraperService();
    const stories = await scraper.scrapeRedditStories(category, limit);
    
    console.log(`✅ API: Successfully scraped ${stories.length} stories`);
    
    return NextResponse.json({
      success: true,
      stories,
      category,
      count: stories.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ API: Reddit scraping failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to scrape Reddit stories',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}