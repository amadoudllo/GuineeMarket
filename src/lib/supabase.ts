import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase: any;

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('votre_url') || supabaseAnonKey.includes('votre_cle')) {
  console.warn('⚠️  Configuration Supabase requise:');
  console.warn('1. Allez sur https://supabase.com/dashboard');
  console.warn('2. Sélectionnez votre projet');
  console.warn('3. Allez dans Settings > API');
  console.warn('4. Copiez votre URL et votre clé anon dans le fichier .env');
  console.warn('5. Redémarrez le serveur de développement');
  
  // Créer un client Supabase factice pour éviter les erreurs
  supabase = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signUp: () => Promise.resolve({ data: null, error: { message: 'Configuration Supabase requise' } }),
      signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Configuration Supabase requise' } }),
      signOut: () => Promise.resolve({ error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null })
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: () => Promise.resolve({ data: null, error: { message: 'Configuration Supabase requise' } })
        })
      }),
      insert: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: null, error: { message: 'Configuration Supabase requise' } })
        })
      })
    })
  };
} else {
  supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
}

export { supabase };