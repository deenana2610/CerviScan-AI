import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lirvuqhhjkjnohcrvvru.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpcnZ1cWhoamtqbm9oY3J2dnJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAxNjY3NzAsImV4cCI6MjEwNTc0Mjc3MH0.OZ52R4GEzlF-bV5ukPwoI8reXsBOqQE5dZw39DldVEQ';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
