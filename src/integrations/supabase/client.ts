// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://uvyjxyhxwgjrvtaeuzme.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2eWp4eWh4d2dqcnZ0YWV1em1lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUyMjkxNTQsImV4cCI6MjA1MDgwNTE1NH0.sK_DxVJESWegyF1BwqVuknedRn6HCtQBsQf5Z3TaCyE";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);