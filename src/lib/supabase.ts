import { createClient } from '@supabase/supabase-js';

// Lovable note: Try to get globals from Lovable's integration first; fallback to project constants
const supabaseUrl = (globalThis as any).__SUPABASE_URL__ || "https://efaohdwvitrxanzzlgew.supabase.co";
const supabaseAnonKey = (globalThis as any).__SUPABASE_ANON_KEY__ || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmYW9oZHd2aXRyeGFuenpsZ2V3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MDY1NzUsImV4cCI6MjA3Mjk4MjU3NX0.B8vt2ZRZnANwrZvZ2_THBYYLop484bcPKr2Gi5wQV0Q";

let client: any = null;
try {
  if (supabaseUrl && supabaseAnonKey) {
    client = createClient(supabaseUrl, supabaseAnonKey);
  }
} catch (e) {
  // Silently ignore client creation errors; consumer will handle missing client
}

export const hasSupabase = Boolean(client);
export const supabase = client;

export const invokeEdgeFunction = async (name: string, body?: any) => {
  if (!client) {
    throw new Error('Supabase не настроен: проверьте подключение вверху справа.');
  }
  return client.functions.invoke(name, { body });
};