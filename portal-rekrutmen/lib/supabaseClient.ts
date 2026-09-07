import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://qkzdimhcluvbqliovpau.supabase.co";

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFremRpbWhjbHV2YnFsaW92cGF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc4ODkzNzksImV4cCI6MjEwMzQ2NTM3OX0.VLtsoDWZjsqy7OK7Fjk78tsCCIh5cG0Nnh8dXcu1Fjk";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
