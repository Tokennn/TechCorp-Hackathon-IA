# TechCorp IA — Interface de chat

Interface web de chat du **Challenge IA TechCorp**, propulsée par le modèle
**Phi-3.5-Financial**. Design inspiré du template _AISpace_ (thème clair, accent
indigo/bleu, dégradé d'ambiance), construit avec **React + Vite + Tailwind CSS v4**.

> État actuel : **front uniquement**. Les réponses sont simulées (mock en
> streaming). Le branchement au vrai serveur d'inférence se fait en un point.

## Démarrer

```bash
npm install
npm run dev
```

L'app est servie sur http://localhost:5173

## Build de production

```bash
npm run build
npm run preview
```

## Brancher le modèle (équipe Infra / IA)

(Tout passe par [`src/lib/api.js`](src/lib/api.js)) :

1. Copier `.env.example` en `.env` et régler `VITE_INFERENCE_URL` + `VITE_MODEL`.
2. Dans `sendChatMessage`, remplacer le bloc _MOCK_ par l'appel
   `streamFromOllama(...)` (déjà écrit, compatible Ollama `/api/chat` en
   streaming NDJSON).



