import { useMemo } from 'react'
import { useAuth } from '@clerk/react'
import { createClient } from '@supabase/supabase-js'

// ---------------------------------------------------------------------------
// Client Supabase authentifié par Clerk.
// Le token de session Clerk est injecté à chaque requête (`accessToken`),
// Supabase le vérifie (intégration Third-Party Auth) et applique la RLS :
// chaque utilisateur ne voit que SES conversations.
//
// Si les variables d'env ne sont pas renseignées, le hook renvoie `null`
// → l'app fonctionne normalement, l'historique est simplement désactivé.
// ---------------------------------------------------------------------------

const URL = import.meta.env.VITE_SUPABASE_URL
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(URL && ANON_KEY)

export function useSupabase() {
  const { getToken } = useAuth()

  return useMemo(() => {
    if (!isSupabaseConfigured) return null
    return createClient(URL, ANON_KEY, {
      accessToken: async () => (await getToken()) ?? null,
      auth: { persistSession: false },
    })
  }, [getToken])
}
