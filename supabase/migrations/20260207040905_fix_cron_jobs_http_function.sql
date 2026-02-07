/*
  # Fix Cron Jobs HTTP Function Call

  ## Problem
  The existing cron jobs were failing with error:
  "function extensions.http_post() does not exist"

  ## Solution
  - Remove old cron jobs that used incorrect function path
  - Create new cron jobs using correct function path: net.http_post()
  - The pg_net extension provides http_post in the 'net' schema, not 'extensions'

  ## Changes
  1. Unschedule existing broken jobs
  2. Create new jobs with correct net.http_post() function call
*/

-- Remove existing broken cron jobs
SELECT cron.unschedule('fetch-rss-hourly');
SELECT cron.unschedule('cleanup-old-articles-daily');

-- Schedule fetch-rss to run every hour with correct function
SELECT cron.schedule(
  'fetch-rss-hourly',
  '0 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://nmpntgusyjmfpyexluxy.supabase.co/functions/v1/fetch-rss',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tcG50Z3VzeWptZnB5ZXhsdXh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzODc5NDksImV4cCI6MjA4NTk2Mzk0OX0.nAnePQ36-CWiof0e2_dSXTGyb50AS-vUVPKjZyZrxG4"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);

-- Schedule cleanup-old-articles to run daily at 5:00 AM with correct function
SELECT cron.schedule(
  'cleanup-old-articles-daily',
  '0 5 * * *',
  $$
  SELECT net.http_post(
    url := 'https://nmpntgusyjmfpyexluxy.supabase.co/functions/v1/cleanup-old-articles',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tcG50Z3VzeWptZnB5ZXhsdXh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzODc5NDksImV4cCI6MjA4NTk2Mzk0OX0.nAnePQ36-CWiof0e2_dSXTGyb50AS-vUVPKjZyZrxG4"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);
