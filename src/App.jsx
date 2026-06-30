import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useAuth } from '@clerk/react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ChatView from './components/ChatView'
import Particles from './components/Particles'
import Sidebar from './components/Sidebar'
import { sendChatMessage } from './lib/api'
import { useSupabase } from './lib/useSupabase'
import {
  listConversations,
  fetchMessages,
  createConversation,
  addMessage,
  deleteConversation,
} from './lib/history'

let idCounter = 0
const nextId = () => `m-${++idCounter}`

export default function App() {
  const supabase = useSupabase()
  const { isSignedIn } = useAuth()

  const [messages, setMessages] = useState([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [conversations, setConversations] = useState([])
  const [currentConversationId, setCurrentConversationId] = useState(null)
  const [loadingConvs, setLoadingConvs] = useState(false)
  const [dark, setDark] = useState(
    () =>
      localStorage.getItem('tc-theme') === 'dark' ||
      (!localStorage.getItem('tc-theme') &&
        window.matchMedia('(prefers-color-scheme: dark)').matches),
  )
  const abortRef = useRef(null)
  const themeAnimatingRef = useRef(false)

  // Synchronise la classe `dark` sur <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('tc-theme', dark ? 'dark' : 'light')
  }, [dark])

  // Charge la liste des conversations de l'utilisateur connecté
  useEffect(() => {
    if (!supabase || !isSignedIn) {
      setConversations([])
      return
    }
    let active = true
    setLoadingConvs(true)
    listConversations(supabase)
      .then((rows) => active && setConversations(rows))
      .catch((e) => console.error('Chargement historique échoué', e))
      .finally(() => active && setLoadingConvs(false))
    return () => {
      active = false
    }
  }, [supabase, isSignedIn])

  const showSidebar = Boolean(supabase && isSignedIn)

  const handleSend = useCallback(
    async (text) => {
      if (isStreaming) return

      const userMsg = { id: nextId(), role: 'user', content: text }
      const assistantId = nextId()
      const assistantMsg = {
        id: assistantId,
        role: 'assistant',
        content: '',
        pending: true,
      }

      // Construit l'historique envoyé au modèle (avant d'ajouter le placeholder)
      const history = [...messages, userMsg].map(({ role, content }) => ({
        role,
        content,
      }))

      setMessages((prev) => [...prev, userMsg, assistantMsg])
      setIsStreaming(true)

      const controller = new AbortController()
      abortRef.current = controller

      // Persistance : crée la conversation au 1ᵉʳ message, enregistre la question.
      let convId = currentConversationId
      if (supabase) {
        try {
          if (!convId) {
            const conv = await createConversation(supabase, text)
            convId = conv.id
            setCurrentConversationId(convId)
            setConversations((prev) => [conv, ...prev])
          }
          await addMessage(supabase, convId, 'user', text)
        } catch (e) {
          console.error('Enregistrement de la question échoué', e)
        }
      }

      try {
        const fullText = await sendChatMessage(history, {
          signal: controller.signal,
          onToken: (chunk) => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? { ...m, content: m.content + chunk, pending: false }
                  : m,
              ),
            )
          },
        })

        // Enregistre la réponse de l'assistant
        if (supabase && convId && fullText) {
          try {
            await addMessage(supabase, convId, 'assistant', fullText)
          } catch (e) {
            console.error('Enregistrement de la réponse échoué', e)
          }
        }
      } catch (err) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  pending: false,
                  content:
                    m.content ||
                    "⚠️ Impossible de joindre le serveur d'inférence. Vérifiez que le modèle est bien déployé.",
                }
              : m,
          ),
        )
        // eslint-disable-next-line no-console
        console.error(err)
      } finally {
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, pending: false } : m)),
        )
        setIsStreaming(false)
        abortRef.current = null
      }
    },
    [isStreaming, messages, supabase, currentConversationId],
  )

  // Bascule de thème avec révélation circulaire GSAP (fiable cross-browser).
  // Un disque de la couleur du nouveau thème se déploie depuis le bouton,
  // recouvre l'écran, puis le thème bascule sous le voile qui se dissipe.
  const handleToggleTheme = useCallback(
    (e) => {
      if (themeAnimatingRef.current) return
      const next = !dark
      const prefersReduced = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches

      if (prefersReduced) {
        setDark(next)
        return
      }

      // Origine de la révélation = centre du bouton de bascule
      const rect = e.currentTarget.getBoundingClientRect()
      const x = rect.left + rect.width / 2
      const y = rect.top + rect.height / 2
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      )

      // Voile plein écran coloré avec le fond du PROCHAIN thème
      const overlay = document.createElement('div')
      overlay.style.position = 'fixed'
      overlay.style.inset = '0'
      overlay.style.zIndex = '9999'
      overlay.style.pointerEvents = 'none'
      overlay.style.background = next ? '#2c2a15' : '#f3eedb'
      overlay.style.clipPath = `circle(0px at ${x}px ${y}px)`
      document.body.appendChild(overlay)
      themeAnimatingRef.current = true

      gsap.to(overlay, {
        duration: 0.6,
        ease: 'power3.inOut',
        clipPath: `circle(${endRadius}px at ${x}px ${y}px)`,
        onComplete: () => {
          // Le voile couvre tout : on bascule le thème en dessous…
          setDark(next)
          // …puis on dissipe le voile pour révéler le nouveau contenu.
          gsap.to(overlay, {
            duration: 0.35,
            opacity: 0,
            ease: 'power1.out',
            onComplete: () => {
              overlay.remove()
              themeAnimatingRef.current = false
            },
          })
        },
      })
    },
    [dark],
  )

  const handleStop = useCallback(() => {
    abortRef.current?.abort()
    setIsStreaming(false)
  }, [])

  const handleNewConversation = useCallback(() => {
    if (isStreaming) abortRef.current?.abort()
    setMessages([])
    setCurrentConversationId(null)
    setIsStreaming(false)
  }, [isStreaming])

  // Charge une conversation de l'historique au clic dans la sidebar
  const loadConversation = useCallback(
    async (id) => {
      if (!supabase) return
      if (isStreaming) abortRef.current?.abort()
      setIsStreaming(false)
      setCurrentConversationId(id)
      try {
        const rows = await fetchMessages(supabase, id)
        setMessages(
          rows.map((r) => ({ id: r.id, role: r.role, content: r.content })),
        )
      } catch (e) {
        console.error('Chargement de la conversation échoué', e)
      }
    },
    [supabase, isStreaming],
  )

  const handleDeleteConversation = useCallback(
    async (id) => {
      if (!supabase) return
      try {
        await deleteConversation(supabase, id)
        setConversations((prev) => prev.filter((c) => c.id !== id))
        if (id === currentConversationId) {
          setMessages([])
          setCurrentConversationId(null)
        }
      } catch (e) {
        console.error('Suppression échouée', e)
      }
    },
    [supabase, currentConversationId],
  )

  const hasConversation = messages.length > 0

  return (
    <div className="relative h-screen overflow-hidden bg-paper text-ink dark:bg-brand-900 dark:text-brand-50">
      {/* Dégradé d'ambiance crème/olive */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-paper via-paper to-paper-dark dark:from-brand-900 dark:via-brand-900 dark:to-brand-800" />
        <div className="absolute -top-40 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-brand-300/25 blur-[120px] dark:bg-brand-600/15" />
      </div>

      {/* Particules en fond de site (couche interactive globale) */}
      <div className="fixed inset-0 -z-10">
        <Particles
          particleColors={['#66632d', '#84803a', '#4d4a24']}
          particleCount={220}
          particleSpread={12}
          speed={0.08}
          particleBaseSize={90}
          moveParticlesOnHover
          alphaParticles
          disableRotation={false}
        />
      </div>

      <Navbar dark={dark} onToggleDark={handleToggleTheme} />

      <main className="h-full">
        <div className="flex h-full">
          {showSidebar && (
            <Sidebar
              conversations={conversations}
              currentId={currentConversationId}
              loading={loadingConvs}
              onSelect={loadConversation}
              onNew={handleNewConversation}
              onDelete={handleDeleteConversation}
            />
          )}

          <div className="relative h-full flex-1 overflow-hidden">
            {hasConversation ? (
              <ChatView
                messages={messages}
                isStreaming={isStreaming}
                onSend={handleSend}
                onStop={handleStop}
              />
            ) : (
              <Hero onSend={handleSend} />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
