/*
  # Fix Security Issues

  This migration addresses multiple security and optimization concerns identified in the database audit.

  ## Changes

  ### 1. Remove Unused Index
  - Drop `articles_feed_id_idx` index that is not being utilized
  - Foreign key constraints already provide adequate lookup performance

  ### 2. Move pg_net Extension to Extensions Schema
  - Relocate `pg_net` from public schema to extensions schema
  - Prevents potential security issues from having extensions in public schema
  - Creates extensions schema if it doesn't exist

  ### 3. Fix Function Search Path
  - Alter `set_app_setting` function to use immutable search_path
  - Sets explicit search_path to prevent potential SQL injection via search_path manipulation
  - Ensures function always operates in controlled schema context

  ## Security Impact
  - Reduces attack surface by isolating extensions
  - Prevents search_path based SQL injection
  - Optimizes database performance by removing unused indexes

  ## Notes
  - Auth DB Connection Strategy must be changed manually in Supabase Dashboard
  - Navigate to: Project Settings → Database → Connection Pooler
  - Change from fixed (10 connections) to percentage-based allocation
*/

-- 1. Drop unused index on articles.feed_id
DROP INDEX IF EXISTS articles_feed_id_idx;

-- 2. Move pg_net extension to extensions schema
-- Create extensions schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS extensions;

-- Move pg_net extension from public to extensions schema
-- Note: We need to drop and recreate the extension
DROP EXTENSION IF EXISTS pg_net CASCADE;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- 3. Fix set_app_setting function with immutable search_path
DROP FUNCTION IF EXISTS public.set_app_setting(text, text);

CREATE OR REPLACE FUNCTION public.set_app_setting(
  setting_key text, 
  setting_value text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO app_settings (key, value, updated_at)
  VALUES (setting_key, setting_value, now())
  ON CONFLICT (key) DO UPDATE
  SET value = EXCLUDED.value, updated_at = now();

  EXECUTE format('ALTER DATABASE %I SET app.settings.%I = %L', current_database(), setting_key, setting_value);
END;
$$;
