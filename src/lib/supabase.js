import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ksqjirnsiqgxnhzpummx.supabase.co';
// Note: In a real production app, you should use environment variables (e.g. import.meta.env.VITE_SUPABASE_ANON_KEY).
// Since this is a simple static PWA without env setup and it's trust-based, we hardcode the ANON key for convenience.
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzcWppcm5zaXFneG5oenB1bW14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0MTE2MjAsImV4cCI6MjA5Nzk4NzYyMH0.TLT7Llt_kjEgqJrcULRiXW6xkhkkloNpGBdtxarS2js';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
