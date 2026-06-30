// ---------------------------------------------------------------------------
// Accès à l'historique des conversations (Supabase).
// La RLS filtre déjà par utilisateur : pas besoin de passer le user_id.
// ---------------------------------------------------------------------------

const TITLE_MAX = 60

export function makeTitle(text) {
  const clean = text.trim().replace(/\s+/g, ' ')
  return clean.length > TITLE_MAX ? `${clean.slice(0, TITLE_MAX)}…` : clean
}

// Liste des conversations de l'utilisateur (plus récentes d'abord).
export async function listConversations(supabase) {
  const { data, error } = await supabase
    .from('conversations')
    .select('id, title, created_at')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

// Messages d'une conversation (ordre chronologique).
export async function fetchMessages(supabase, conversationId) {
  const { data, error } = await supabase
    .from('messages')
    .select('id, role, content, created_at')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data || []
}

// Crée une conversation et renvoie son id (titre = 1ʳᵉ question).
export async function createConversation(supabase, firstPrompt) {
  const { data, error } = await supabase
    .from('conversations')
    .insert({ title: makeTitle(firstPrompt) })
    .select('id, title, created_at')
    .single()
  if (error) throw error
  return data
}

// Ajoute un message à une conversation.
export async function addMessage(supabase, conversationId, role, content) {
  const { error } = await supabase
    .from('messages')
    .insert({ conversation_id: conversationId, role, content })
  if (error) throw error
}

// Supprime une conversation (messages supprimés en cascade côté DB).
export async function deleteConversation(supabase, conversationId) {
  const { error } = await supabase
    .from('conversations')
    .delete()
    .eq('id', conversationId)
  if (error) throw error
}
