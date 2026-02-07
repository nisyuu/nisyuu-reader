import { schedule } from '@netlify/functions';
import { fetchAndStoreRSSFeeds } from '../../lib/rss-fetcher';

process.removeAllListeners('warning');
process.on('warning', (warning) => {
  if (warning.name === 'DeprecationWarning' && warning.message.includes('punycode')) {
    return;
  }
  console.warn(warning);
});

const handler = schedule('0 * * * *', async () => {
  try {
    console.log('Starting RSS fetch job...');
    const results = await fetchAndStoreRSSFeeds();
    console.log('RSS fetch completed:', results);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'RSS feeds fetched successfully',
        results,
      }),
    };
  } catch (error) {
    console.error('RSS fetch failed:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Failed to fetch RSS feeds',
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
});

export { handler };
