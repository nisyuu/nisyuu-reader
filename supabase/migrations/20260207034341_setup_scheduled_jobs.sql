/*
  # Setup Scheduled Jobs for RSS Feed Reader

  This migration sets up automated scheduled jobs for the RSS feed reader application.

  ## Changes

  ### 1. Enable pg_cron Extension
  - Installs pg_cron extension for scheduled job management
  - Creates cron schema automatically

  ### 2. Schedule fetch-rss Edge Function
  - **Schedule**: Every hour (0 minutes past each hour)
  - **Purpose**: Fetches new articles from all RSS feeds
  - **Cron Expression**: `0 * * * *` (runs at :00 of every hour)
  - **Job Name**: `fetch-rss-hourly`

  ### 3. Schedule cleanup-old-articles Edge Function
  - **Schedule**: Daily at 5:00 AM JST
  - **Purpose**: Removes old articles to maintain database size
  - **Cron Expression**: `0 5 * * *` (runs at 5:00 AM every day)
  - **Job Name**: `cleanup-old-articles-daily`

  ## Implementation Details

  Both jobs use pg_cron to schedule HTTP POST requests to Supabase Edge Functions:
  - Uses net extension for HTTP requests
  - Includes proper authorization headers
  - Runs with appropriate privileges

  ## Security

  - Jobs run with controlled permissions
  - Authentication handled via anon key
  - Network requests isolated to Supabase infrastructure

  ## Monitoring

  To view scheduled jobs:
  ```sql
  SELECT * FROM cron.job;
  ```

  To view job run history:
  ```sql
  SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;
  ```
*/

-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule fetch-rss to run every hour
-- Runs at :00 of every hour
SELECT cron.schedule(
  'fetch-rss-hourly',
  '0 * * * *',
  $$
  SELECT extensions.http_post(
    url := 'https://nmpntgusyjmfpyexluxy.supabase.co/functions/v1/fetch-rss',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tcG50Z3VzeWptZnB5ZXhsdXh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzODc5NDksImV4cCI6MjA4NTk2Mzk0OX0.nAnePQ36-CWiof0e2_dSXTGyb50AS-vUVPKjZyZrxG4"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);

-- Schedule cleanup-old-articles to run daily at 5:00 AM
-- Runs at 5:00 AM every day
SELECT cron.schedule(
  'cleanup-old-articles-daily',
  '0 5 * * *',
  $$
  SELECT extensions.http_post(
    url := 'https://nmpntgusyjmfpyexluxy.supabase.co/functions/v1/cleanup-old-articles',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tcG50Z3VzeWptZnB5ZXhsdXh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzODc5NDksImV4cCI6MjA4NTk2Mzk0OX0.nAnePQ36-CWiof0e2_dSXTGyb50AS-vUVPKjZyZrxG4"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);
