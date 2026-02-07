/*
  # Remove Unused app_settings Table and Function

  This migration removes the `app_settings` table and `set_app_setting` function
  which are not being used in the application.

  ## Changes

  ### 1. Drop set_app_setting Function
  - Removes the `set_app_setting` function from public schema
  - This function was created to manage app settings but is not utilized

  ### 2. Drop app_settings Table
  - Removes the `app_settings` table from public schema
  - This table stored configuration values but the application uses environment variables instead

  ## Rationale

  The application currently uses environment variables (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  directly in edge functions rather than reading from the database. The app_settings table
  and its related function are not referenced anywhere in the codebase and can be safely removed.
*/

-- Drop the set_app_setting function
DROP FUNCTION IF EXISTS public.set_app_setting(text, text);

-- Drop the app_settings table
DROP TABLE IF EXISTS public.app_settings;
