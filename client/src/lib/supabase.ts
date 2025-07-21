// lib/supabase.ts (or .js)
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://ayfbwhkpaatupngukbzl.supabase.co";
const supabaseAnonKey ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5ZmJ3aGtwYWF0dXBuZ3VrYnpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1OTg3MjUsImV4cCI6MjA2ODE3NDcyNX0.TBmeuQAmjiKQIgr4Zh_BwjJAJbEtgYcJBl8LOK_8d78";

// Basic check (add more robust error handling in production)
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is not set. Check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);