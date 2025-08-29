// lib/supabase.ts (or .js)
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://ccjtuiqnthnftvmzxrud.supabase.co";
const supabaseAnonKey ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjanR1aXFudGhuZnR2bXp4cnVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyODQ3MjYsImV4cCI6MjA3MTg2MDcyNn0.YL4cysGrsWqvLpTNH9Z2RM0Q_KoGrqGQaNok_OIX-z0";

// Basic check (add more robust error handling in production)
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is not set. Check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);