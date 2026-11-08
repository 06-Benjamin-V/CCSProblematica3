import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let browserClient: SupabaseClient | undefined;

// La autorización de datos debe aplicarse mediante políticas RLS.
export function getSupabaseBrowserClient(): SupabaseClient {
  if (import.meta.env.SSR) {
    throw new Error('Este cliente es exclusivo del navegador.');
  }

  if (browserClient) return browserClient;

  const url = import.meta.env.PUBLIC_SUPABASE_URL;
  const key = import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error('Configura las variables públicas de Supabase en .env.');
  }

  browserClient = createClient(url, key);
  return browserClient;
}
