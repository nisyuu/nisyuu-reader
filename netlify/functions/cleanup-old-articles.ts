import { schedule } from '@netlify/functions';
import { cleanupOldArticles } from '../../lib/rss-fetcher';

const handler = schedule('0 20 * * *', async () => {
  try {
    console.log('Starting article cleanup job...');
    const results = await cleanupOldArticles(7);
    console.log('Article cleanup completed:', results);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Old articles cleaned up successfully',
        results,
      }),
    };
  } catch (error) {
    console.error('Article cleanup failed:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Failed to cleanup old articles',
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
});

export { handler };
