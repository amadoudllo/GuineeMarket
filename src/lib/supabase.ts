import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase: any;

if (!supabaseUrl || !supabaseAnonKey || 
    supabaseUrl === 'votre_url_supabase' || 
    supabaseAnonKey === 'votre_cle_anonyme_supabase') {
  console.warn('⚠️  Configuration Supabase requise:');
  console.warn('1. Créez un fichier .env à la racine du projet');
  console.warn('2. Ajoutez vos clés Supabase:');
  console.warn('   VITE_SUPABASE_URL=votre_vraie_url');
  console.warn('   VITE_SUPABASE_ANON_KEY=votre_vraie_cle');
  console.warn('3. Redémarrez le serveur de développement');
  
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
          single: () => Promise.resolve({ data: null, error: { message: 'Configuration Supabase requise' } }),
          maybeSingle: () => Promise.resolve({ data: null, error: { message: 'Configuration Supabase requise' } })
        }),
        insert: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: null, error: { message: 'Configuration Supabase requise' } })
          })
        }),
        update: () => ({
          eq: () => ({
            select: () => ({
              single: () => Promise.resolve({ data: null, error: { message: 'Configuration Supabase requise' } })
            })
          })
        }),
        delete: () => ({
          eq: () => Promise.resolve({ error: { message: 'Configuration Supabase requise' } })
        }),
        order: () => ({
          eq: () => ({
            select: () => ({
              eq: () => ({
                eq: () => ({
                  eq: () => ({
                    eq: () => ({
                      eq: () => ({
                        eq: () => Promise.resolve({ data: [], error: { message: 'Configuration Supabase requise' } })
                      })
                    })
                  })
                })
              })
            })
          })
        })
      }),
      rpc: () => Promise.resolve({ error: { message: 'Configuration Supabase requise' } })
    })
  };
} else {
  try {
    supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
    console.log('✅ Client Supabase initialisé avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation du client Supabase:', error);
    // Fallback vers le client factice
    supabase = {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signUp: () => Promise.resolve({ data: null, error: { message: 'Erreur de configuration Supabase' } }),
        signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Erreur de configuration Supabase' } }),
        signOut: () => Promise.resolve({ error: null }),
        getUser: () => Promise.resolve({ data: { user: null }, error: null })
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: null, error: { message: 'Erreur de configuration Supabase' } }),
            maybeSingle: () => Promise.resolve({ data: null, error: { message: 'Erreur de configuration Supabase' } })
          }),
          insert: () => ({
            select: () => ({
              single: () => Promise.resolve({ data: null, error: { message: 'Erreur de configuration Supabase' } })
            })
          }),
          update: () => ({
            eq: () => ({
              select: () => ({
                single: () => Promise.resolve({ data: null, error: { message: 'Erreur de configuration Supabase' } })
              })
            })
          }),
          delete: () => ({
            eq: () => Promise.resolve({ error: { message: 'Erreur de configuration Supabase' } })
          }),
          order: () => ({
            eq: () => ({
              select: () => ({
                eq: () => ({
                  eq: () => ({
                    eq: () => ({
                      eq: () => ({
                        eq: () => Promise.resolve({ data: [], error: { message: 'Erreur de configuration Supabase' } })
                      })
                    })
                  })
                })
              })
            })
          })
        }),
        rpc: () => Promise.resolve({ error: { message: 'Erreur de configuration Supabase' } })
      })
    };
  }
}

export { supabase };