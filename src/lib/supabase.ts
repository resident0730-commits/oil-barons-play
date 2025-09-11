import { createClient } from '@supabase/supabase-js';

// Lovable note: Try to get globals from Lovable's integration first
const supabaseUrl = (globalThis as any).__SUPABASE_URL__ || (import.meta as any).env?.VITE_SUPABASE_URL;
const supabaseAnonKey = (globalThis as any).__SUPABASE_ANON_KEY__ || (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

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