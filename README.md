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

Tout passe par [`src/lib/api.js`](src/lib/api.js) :

1. Copier `.env.example` en `.env` et régler `VITE_INFERENCE_URL` + `VITE_MODEL`.
2. Dans `sendChatMessage`, remplacer le bloc _MOCK_ par l'appel
   `streamFromOllama(...)` (déjà écrit, compatible Ollama `/api/chat` en
   streaming NDJSON).

L'interface gère déjà : streaming token-par-token, bouton **Stop**, historique
de conversation, gestion d'erreur réseau.

## Structure

```
src/
├── App.jsx              # État global, dark mode, logique d'envoi/streaming
├── lib/api.js           # Couche d'inférence (mock + impl. Ollama de référence)
└── components/
    ├── Navbar.jsx       # En-tête + toggle thème
    ├── Hero.jsx         # Vue d'accueil (badge, titre, input, suggestions)
    ├── ChatView.jsx     # Vue conversation (messages + input)
    ├── ChatInput.jsx    # Champ de saisie (Joindre / Analyse / mic / envoi)
    ├── MessageBubble.jsx# Bulle user/assistant + indicateur de saisie
    ├── SuggestionPills.jsx
    ├── FormattedText.jsx# Mini-rendu Markdown (gras, listes)
    └── Logo.jsx
```

## Personnalisation rapide

- **Couleurs de marque** : variables `--color-brand-*` dans `src/index.css`.
- **Suggestions** : tableau `SUGGESTIONS` dans `src/components/SuggestionPills.jsx`.
- **Police** : Plus Jakarta Sans (chargée dans `index.html`).
