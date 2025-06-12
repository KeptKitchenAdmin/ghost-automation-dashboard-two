/**
 * Sample Reddit Stories for Testing Video Generation
 * These are real story formats but anonymized content for testing
 */

import { RedditStory } from '../types/reddit-automation';

export const SAMPLE_STORIES: RedditStory[] = [
  {
    id: 'test_drama_001',
    title: 'AITA for refusing to share my inheritance with my siblings?',
    content: `My grandmother passed away last year and left me her house in her will. My siblings are upset because they think the house should be split between all of us, but grandmother specifically left it to me because I was the one who took care of her for the last 5 years of her life.

I moved in with her when she got sick, helped with her medications, drove her to doctor appointments, and basically put my life on hold. My siblings visited maybe once a month and always had excuses for why they couldn't help more.

Now they're saying I'm being selfish and that "family should share everything." They want me to sell the house and split the money, but this house means everything to me. It's where I have all my memories with grandmother.

Am I wrong for wanting to keep what was legally left to me?`,
    subreddit: 'AmItheAsshole',
    upvotes: 15420,
    comments: 2847,
    category: 'drama',
    viral_score: 28.5,
    estimated_duration: 245,
    posted_at: new Date('2024-01-15').toISOString()
  },
  {
    id: 'test_horror_001',
    title: 'Something is wrong with my neighbor\'s house',
    content: `I moved into a quiet suburban neighborhood three months ago. Everything seemed normal until I started noticing strange things about the house next door.

The family that lives there has three kids, but I only ever see two of them playing outside. When I asked about the third child, the parents got really uncomfortable and changed the subject quickly.

Last week, I was working late in my home office when I heard crying coming from their house. It sounded like a child, but it was 2 AM and all the lights were off. The crying went on for hours.

Yesterday, I saw the mother putting a plate of food on the back porch and calling out "It's dinnertime" but nobody came to get it. She left it there for an hour before taking it back inside, untouched.

I'm starting to think something terrible happened to their third child, but I don't know what to do with this information.`,
    subreddit: 'nosleep',
    upvotes: 8932,
    comments: 1205,
    category: 'horror',
    viral_score: 22.1,
    estimated_duration: 180,
    posted_at: new Date('2024-01-18').toISOString()
  },
  {
    id: 'test_revenge_001',
    title: 'Terrible manager fired me for being 5 minutes late, so I got him fired instead',
    content: `I worked at a tech company for two years with a perfect attendance record. My manager, Dave, was known for being a micromanager who hated when employees had any flexibility.

One morning, my train was delayed and I walked in at 9:05 AM instead of 9:00 AM. Dave was waiting at my desk with a termination letter, claiming I was "chronically late" even though this was literally my first time being late in two years.

Here's where the revenge comes in. While packing my things, I remembered that Dave had been asking me to fudge numbers in our quarterly reports to make his department look better. I had been keeping emails as proof because it made me uncomfortable.

I forwarded those emails to HR, the CEO, and our external auditors. Within a week, Dave was not only fired but the company was facing a serious investigation for financial misrepresentation.

The best part? They offered me my job back with a promotion and Dave's old salary. I declined and found a better job, but I heard Dave is still unemployed six months later.

Sometimes karma needs a little help.`,
    subreddit: 'ProRevenge',
    upvotes: 25680,
    comments: 3421,
    category: 'revenge',
    viral_score: 35.2,
    estimated_duration: 280,
    posted_at: new Date('2024-01-20').toISOString()
  },
  {
    id: 'test_wholesome_001',
    title: 'Homeless man returned my wallet, so I returned the favor',
    content: `Last week, I dropped my wallet while getting off the bus downtown. I didn't realize it until I got to work and went to buy coffee. I panicked because it had my credit cards, ID, and about $300 cash.

I retraced my steps and found a homeless man named Robert sitting near the bus stop. He held up my wallet and asked if I was looking for it. Everything was still inside, including all the cash.

I tried to give him some money as a thank you, but he refused, saying "I know what it's like to lose everything important." That broke my heart.

I couldn't stop thinking about Robert's kindness, so I went back the next day with a bag of food, some warm clothes, and information about local shelters and job programs. We talked for an hour, and I learned he's a veteran who's been struggling since losing his job.

Long story short, I helped him get into a transitional housing program and connected him with a veteran's employment service. He starts a new job at a warehouse next week.

Sometimes one act of kindness creates a chain reaction. Robert saved my day, and I hope I helped save his future.`,
    subreddit: 'MadeMeSmile',
    upvotes: 18750,
    comments: 892,
    category: 'wholesome',
    viral_score: 31.8,
    estimated_duration: 210,
    posted_at: new Date('2024-01-22').toISOString()
  },
  {
    id: 'test_mystery_001',
    title: 'Found a hidden room in my basement with disturbing contents',
    content: `I bought a 1940s house three months ago and finally got around to cleaning out the basement. While moving some old furniture, I noticed the wall sounded hollow in one section.

After some investigation, I found a hidden panel that opened to reveal a small room about 6x8 feet. Inside were dozens of old photographs, newspaper clippings, and handwritten notes dating from 1947 to 1952.

The photographs show the same woman in different locations around town, but she doesn't look aware she's being photographed. The newspaper clippings are all about a missing woman named Margaret Ellis who disappeared in 1952.

The handwritten notes are the most disturbing part. They detail this woman's daily routine, where she worked, when she got home, who she talked to. The handwriting gets more erratic toward the end, with phrases like "she knows I'm watching" and "must be more careful."

The final entry is dated three days before Margaret Ellis was reported missing.

I called the police, but they said the case is too old and there's no evidence of a crime. The current missing persons detective seemed interested but said there's nothing they can officially do.

I've been researching Margaret Ellis online but can't find any information about what happened to her. The house records show it was owned by a man named Harold Vance during that time period.

Should I keep investigating this myself, or am I opening a door I should leave closed?`,
    subreddit: 'mystery',
    upvotes: 12450,
    comments: 1876,
    category: 'mystery',
    viral_score: 26.3,
    estimated_duration: 310,
    posted_at: new Date('2024-01-25').toISOString()
  }
];

/**
 * Gets a random sample story for testing
 */
export function getRandomSampleStory(): RedditStory {
  const randomIndex = Math.floor(Math.random() * SAMPLE_STORIES.length);
  return SAMPLE_STORIES[randomIndex];
}

/**
 * Gets sample story by category
 */
export function getSampleStoryByCategory(category: RedditStory['category']): RedditStory | null {
  return SAMPLE_STORIES.find(story => story.category === category) || null;
}

/**
 * Gets all sample stories for a specific category
 */
export function getSampleStoriesByCategory(category: RedditStory['category']): RedditStory[] {
  return SAMPLE_STORIES.filter(story => story.category === category);
}

/**
 * Test video generation settings
 */
export const TEST_VIDEO_SETTINGS = {
  duration: 180, // 3 minutes for testing
  voice_id: 'Adam',
  background_url: 'https://github.com/shotstack/test-media/raw/main/footage/beach-overhead.mp4',
  add_captions: true,
  music_volume: 0.3
};

/**
 * Mock API responses for offline testing
 */
export const MOCK_API_RESPONSES = {
  claude_enhancement: {
    success: true,
    enhanced_content: 'This is a mock enhanced story content for testing purposes...',
    cost: 0.008,
    tokens: 250
  },
  shotstack_render: {
    success: true,
    render_id: 'mock_render_123',
    status: 'queued',
    video_url: 'https://mock-video-url.com/test.mp4',
    cost: 1.20
  },
  elevenlabs_tts: {
    success: true,
    audio_url: 'https://mock-audio-url.com/test.mp3',
    duration: 180,
    cost: 0.54
  }
};