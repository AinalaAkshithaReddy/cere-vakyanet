import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gomtkglpmgapobhlyywz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvbXRrZ2xwbWdhcG9iaGx5eXd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4MzM4MzcsImV4cCI6MjA3ODQwOTgzN30.UKGWcWGAEFg1AVOVFueo_NOfLEbYMsbFqVoTY1Mbwk4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});


