// R2 Storage Manager - NO EXTERNAL API CALLS
// Handles reading/writing usage data to Cloudflare R2 storage

interface DailyUsageLog {
  date: string;
  entries: any[];
  totals: Record<string, any>;
  lastUpdated: string;
}

export class R2Storage {
  
  // Read daily usage log from R2
  static async getDailyUsage(date: string): Promise<DailyUsageLog> {
    try {
      if (!process.env.CLOUDFLARE_ACCOUNT_ID || !process.env.CLOUDFLARE_API_TOKEN) {
        console.warn('R2 credentials not configured, using empty data');
        return this.createEmptyDailyLog(date);
      }

      const key = `usage-logs/daily/${date}.json`;
      const bucketName = process.env.R2_BUCKET_NAME || 'ghosttrace-output';
      
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/r2/buckets/${bucketName}/objects/${key}`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
          }
        }
      );

      if (response.ok) {
        return await response.json();
      }
      
      // File doesn't exist yet, return empty
      return this.createEmptyDailyLog(date);
    } catch (error) {
      console.warn(`Failed to read daily usage for ${date}:`, error);
      return this.createEmptyDailyLog(date);
    }
  }

  // Store daily usage log to R2
  static async storeDailyUsage(date: string, data: DailyUsageLog): Promise<void> {
    try {
      if (!process.env.CLOUDFLARE_ACCOUNT_ID || !process.env.CLOUDFLARE_API_TOKEN) {
        console.warn('R2 credentials not configured, skipping storage');
        return;
      }

      const key = `usage-logs/daily/${date}.json`;
      const bucketName = process.env.R2_BUCKET_NAME || 'ghosttrace-output';
      
      await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/r2/buckets/${bucketName}/objects/${key}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...data,
            lastUpdated: new Date().toISOString()
          })
        }
      );
    } catch (error) {
      console.error(`Failed to store daily usage for ${date}:`, error);
    }
  }

  // Get monthly aggregated usage
  static async getMonthlyUsage(monthPrefix: string): Promise<Record<string, any>> {
    try {
      const monthlyTotals: Record<string, any> = {};
      
      // Generate dates for the month
      const year = parseInt(monthPrefix.split('-')[0]);
      const month = parseInt(monthPrefix.split('-')[1]);
      const daysInMonth = new Date(year, month, 0).getDate();
      
      const promises = [];
      for (let day = 1; day <= daysInMonth; day++) {
        const date = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        promises.push(this.getDailyUsage(date));
      }

      const dailyLogs = await Promise.all(promises);
      
      // Aggregate all daily totals
      dailyLogs.forEach(log => {
        Object.entries(log.totals).forEach(([service, stats]: [string, any]) => {
          if (!monthlyTotals[service]) {
            monthlyTotals[service] = { tokens: 0, characters: 0, requests: 0, cost: 0 };
          }
          
          monthlyTotals[service].requests += stats.requests || 0;
          monthlyTotals[service].cost += stats.cost || 0;
          if (stats.tokens) monthlyTotals[service].tokens += stats.tokens;
          if (stats.characters) monthlyTotals[service].characters += stats.characters;
        });
      });

      return monthlyTotals;
    } catch (error) {
      console.error('Failed to get monthly usage:', error);
      return {};
    }
  }

  private static createEmptyDailyLog(date: string): DailyUsageLog {
    return {
      date,
      entries: [],
      totals: {
        openai: { tokens: 0, requests: 0, cost: 0 },
        anthropic: { tokens: 0, requests: 0, cost: 0 },
        elevenlabs: { characters: 0, requests: 0, cost: 0 },
        heygen: { requests: 0, cost: 0 },
        googleCloud: { requests: 0, cost: 0 }
      },
      lastUpdated: new Date().toISOString()
    };
  }
}

export default R2Storage;