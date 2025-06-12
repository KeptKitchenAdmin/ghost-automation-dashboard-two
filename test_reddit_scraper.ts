#!/usr/bin/env ts-node

import { RedditScraperService } from './lib/services/reddit-scraper';

async function testRedditScraper() {
  console.log('🔍 Phase 5: Testing Reddit Scraper Service');
  console.log('=' .repeat(50));
  
  const scraper = new RedditScraperService();
  
  try {
    console.log('Testing "drama" category scraping...');
    const stories = await scraper.scrapeRedditStories('drama', 5);
    
    console.log(`✅ Successfully scraped ${stories.length} stories`);
    
    if (stories.length > 0) {
      const firstStory = stories[0];
      console.log('\n📖 Sample Story:');
      console.log(`Title: ${firstStory.title}`);
      console.log(`Subreddit: r/${firstStory.subreddit}`);
      console.log(`Upvotes: ${firstStory.upvotes}`);
      console.log(`Viral Score: ${firstStory.viral_score}`);
      console.log(`Content Length: ${firstStory.content.length} chars`);
      console.log(`Estimated Duration: ${firstStory.estimated_duration} seconds`);
      console.log('\nFirst 200 chars of content:');
      console.log(firstStory.content.substring(0, 200) + '...');
    }
    
    console.log('\n✅ Reddit scraper test PASSED');
    return true;
    
  } catch (error) {
    console.error('❌ Reddit scraper test FAILED:', error);
    return false;
  }
}

testRedditScraper().then(success => {
  process.exit(success ? 0 : 1);
});