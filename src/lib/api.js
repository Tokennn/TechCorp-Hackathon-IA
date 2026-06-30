// ---------------------------------------------------------------------------
// Couche d'inférence — Challenge IA TechCorp
// ---------------------------------------------------------------------------
// Appelle le serveur d'inférence (LLM) RÉEL. Plus de réponses simulées.
//
// Configuration (dans .env.local) :
//   VITE_INFERENCE_URL = URL du serveur d'inférence (ex : https://.../ollama)
//   VITE_MODEL         = nom du modèle servi (ex : phi3.5-financial)
//
// Implémentation par défaut : Ollama (POST /api/chat, streaming NDJSON).
// Si votre serveur est OpenAI-compatible (vLLM, LM Studio, llama.cpp, Triton…),
// il faudra adapter l'URL, le corps de la requête et le parsing du flux
// (réponses en SSE `data: {...}` avec `choices[].delta.content`).
//
// ⚠️ L'appel part du navigateur du visiteur : l'URL doit être en HTTPS,
//    publiquement joignable et autoriser le CORS de ce site (ou être servie
//    via un reverse-proxy sur le même domaine).
// ---------------------------------------------------------------------------

export const MODEL_NAME = import.meta.env.VITE_MODEL || 'phi3.5-financial'

const INFERENCE_URL =
  import.meta.env.VITE_INFERENCE_URL || 'http://localhost:11434'

/**
 * Envoie l'historique de conversation au serveur d'inférence et renvoie la
 * réponse de l'assistant, en streamant chaque morceau via `onToken`.
 *
 * @param {{role: 'user'|'assistant', content: string}[]} messages
 * @param {{ onToken?: (chunk: string) => void, signal?: AbortSignal }} options
 * @returns {Promise<string>} le texte complet de la réponse
 */
export async function sendChatMessage(messages, { onToken, signal } = {}) {
  const res = await fetch(`${INFERENCE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal,
    body: JSON.stringify({
      model: MODEL_NAME,
      messages: messages.map(({ role, content }) => ({ role, content })),
      stream: true,
    }),
  })

  if (!res.ok || !res.body) {
    throw new Error(`Erreur serveur d'inférence : ${res.status}`)
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let full = ''
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })

    // Ollama renvoie un objet JSON par ligne (NDJSON).
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''
    for (const line of lines) {
      if (!line.trim()) continue
      const json = JSON.parse(line)
      const chunk = json.message?.content || ''
      if (chunk) {
        full += chunk
        onToken?.(chunk)
      }
    }
  }

  return full
}
