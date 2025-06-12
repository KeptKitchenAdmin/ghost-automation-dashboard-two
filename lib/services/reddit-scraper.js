"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedditScraperService = void 0;
class RedditScraperService {
    constructor() {
        this.SUBREDDIT_CONFIGS = {
            drama: ['AmItheAsshole', 'relationship_advice', 'tifu', 'confessions'],
            horror: ['nosleep', 'LetsNotMeet', 'creepyencounters', 'missing411'],
            revenge: ['MaliciousCompliance', 'pettyrevenge', 'ProRevenge', 'NuclearRevenge'],
            wholesome: ['MadeMeSmile', 'wholesomememes', 'HumansBeingBros'],
            mystery: ['mystery', 'UnresolvedMysteries', 'RBI', 'whatisthisthing']
        };
    }
    async scrapeRedditStories(category, limit = 20) {
        console.log('Scraping Reddit using public JSON endpoints (NO API calls)');
        const subreddits = this.SUBREDDIT_CONFIGS[category];
        const stories = [];
        for (const subreddit of subreddits) {
            try {
                const response = await fetch(`https://www.reddit.com/r/${subreddit}/hot.json?limit=${Math.ceil(limit / subreddits.length)}`, {
                    headers: {
                        'User-Agent': 'RedditVideoBot/1.0'
                    }
                });
                if (!response.ok)
                    continue;
                // 🔧 TYPESCRIPT FIX APPLIED - Proper type assertion
                const data = await response.json();
                const posts = data.data.children;
                for (const post of posts) {
                    const postData = post.data;
                    if (postData.upvote_ratio < 0.8 ||
                        postData.ups < 500 ||
                        postData.selftext.length < 200 ||
                        postData.selftext.length > 3000 ||
                        postData.over_18 ||
                        postData.stickied ||
                        this.containsProblematicContent(postData.selftext)) {
                        continue;
                    }
                    const story = {
                        id: postData.id,
                        title: postData.title,
                        content: postData.selftext,
                        subreddit: postData.subreddit,
                        upvotes: postData.ups,
                        comments: postData.num_comments,
                        created_utc: postData.created_utc,
                        url: `https://reddit.com${postData.permalink}`,
                        viral_score: this.calculateViralScore(postData),
                        category,
                        estimated_duration: this.estimateDuration(postData.selftext)
                    };
                    stories.push(story);
                }
            }
            catch (error) {
                console.error(`Error scraping r/${subreddit}:`, error);
            }
        }
        return stories
            .sort((a, b) => b.viral_score - a.viral_score)
            .slice(0, limit);
    }
    calculateViralScore(postData) {
        const ageHours = (Date.now() / 1000 - postData.created_utc) / 3600;
        const upvoteRate = postData.ups / Math.max(ageHours, 1);
        const commentRate = postData.num_comments / Math.max(ageHours, 1);
        const ratio = postData.upvote_ratio;
        return (upvoteRate * 0.4 + commentRate * 0.3 + ratio * 100 * 0.3) / 10;
    }
    estimateDuration(content) {
        const wordCount = content.split(' ').length;
        return Math.ceil((wordCount / 150) * 60);
    }
    containsProblematicContent(text) {
        const bannedWords = [
            'suicide', 'self-harm', 'rape', 'abuse', 'violence',
            'drugs', 'illegal', 'racist', 'sexist'
        ];
        const lowerText = text.toLowerCase();
        return bannedWords.some(word => lowerText.includes(word));
    }
}
exports.RedditScraperService = RedditScraperService;
