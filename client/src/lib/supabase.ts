// lib/supabase.ts (or .js)
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://mcpfhzcxklwfgyhhhojz.supabase.co";
const supabaseAnonKey ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jcGZoemN4a2x3Zmd5aGhob2p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5MTIyNzMsImV4cCI6MjA2ODQ4ODI3M30.8nIjA5SiFDqx82snnVa_mWzmFkRUCNsQB-e6RaVvtCs";

// Basic check (add more robust error handling in production)
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is not set. Check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);