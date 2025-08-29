require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL2,
  process.env.SUPABASE_ANON2
);

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL2,
  process.env.SUPABASE_SERVICE_ROLE_KEY2,
  {
    auth: {
      persistSession: false 
    }
  }
);

module.exports = { supabase, supabaseAdmin };
