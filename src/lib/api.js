// ---------------------------------------------------------------------------
// Couche d'inférence — Challenge IA TechCorp
// ---------------------------------------------------------------------------
// Pour l'instant l'interface fonctionne avec un MOCK (réponses simulées en
// streaming) afin de pouvoir développer le front sans serveur de modèle.
//
// >>> Pour brancher le vrai modèle Phi-3.5-Financial (équipe Infra/IA) :
//     - décommentez `streamFromOllama` ci-dessous
//     - faites pointer `sendChatMessage` dessus
//     - réglez VITE_INFERENCE_URL et VITE_MODEL dans un fichier .env
// ---------------------------------------------------------------------------

export const MODEL_NAME = import.meta.env.VITE_MODEL || 'phi3.5-financial'

const MOCK_REPLIES = [
  "Bonjour 👋 Je suis l'assistant IA de TechCorp, propulsé par le modèle **Phi-3.5-Financial**. Posez-moi une question financière et je vous aiderai à l'analyser.",
  "Bonne question. Sur la base des données disponibles, voici une analyse synthétique :\n\n1. **Tendance** — les indicateurs principaux restent stables sur la période.\n2. **Risque** — exposition modérée, à surveiller sur le trimestre.\n3. **Recommandation** — diversifier pour lisser la volatilité.\n\nSouhaitez-vous que je détaille l'un de ces points ?",
  "Voici comment j'aborderais ce calcul :\n\n- On part des flux de trésorerie nets.\n- On applique un taux d'actualisation prudent.\n- On obtient une valeur actualisée que l'on compare au capital investi.\n\nDites-moi vos chiffres et je lance l'estimation.",
]

let mockIndex = 0

// Découpe un texte en « tokens » approximatifs pour simuler le streaming.
function tokenize(text) {
  return text.match(/\s+|\S+/g) || [text]
}

/**
 * Envoie l'historique de conversation et renvoie la réponse de l'assistant.
 * Simule un streaming token-par-token via le callback `onToken`.
 *
 * @param {{role: 'user'|'assistant', content: string}[]} messages
 * @param {{ onToken?: (chunk: string) => void, signal?: AbortSignal }} options
 * @returns {Promise<string>} le texte complet de la réponse
 */
export async function sendChatMessage(messages, { onToken, signal } = {}) {
  // --- MODE MOCK -----------------------------------------------------------
  const reply = MOCK_REPLIES[mockIndex % MOCK_REPLIES.length]
  mockIndex += 1

  let full = ''
  for (const token of tokenize(reply)) {
    if (signal?.aborted) break
    await new Promise((r) => setTimeout(r, 18 + Math.random() * 30))
    full += token
    onToken?.(token)
  }
  return full

  // --- MODE RÉEL (Ollama) — à activer par l'équipe Infra -------------------
  // return streamFromOllama(messages, { onToken, signal })
}

/* eslint-disable no-unused-vars */
/**
 * Implémentation de référence pour un serveur Ollama exposant /api/chat.
 * Décommentez l'appel dans `sendChatMessage` une fois le serveur en place.
 */
async function streamFromOllama(messages, { onToken, signal } = {}) {
  const baseUrl = import.meta.env.VITE_INFERENCE_URL || 'http://localhost:11434'

  const res = await fetch(`${baseUrl}/api/chat`, {
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
