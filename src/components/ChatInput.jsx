import { useEffect, useRef, useState } from 'react'
import { Paperclip, Globe, Mic, ArrowUp, Square } from 'lucide-react'

export default function ChatInput({
  onSend,
  isStreaming = false,
  onStop,
  autoFocus = false,
  placeholder = 'Posez votre question financière…',
}) {
  const [value, setValue] = useState('')
  const [deepResearch, setDeepResearch] = useState(false)
  const textareaRef = useRef(null)

  // Auto-redimensionnement vertical du textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`
  }, [value])

  useEffect(() => {
    if (autoFocus) textareaRef.current?.focus()
  }, [autoFocus])

  const canSend = value.trim().length > 0 && !isStreaming

  function submit() {
    if (!canSend) return
    onSend(value.trim(), { deepResearch })
    setValue('')
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  return (
    <div className="rounded-3xl border border-brand-300/50 bg-surface/95 p-2.5 shadow-xl shadow-brand-900/10 ring-1 ring-black/[0.02] backdrop-blur dark:border-white/10 dark:bg-brand-800/70 dark:shadow-black/30">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
        placeholder={placeholder}
        className="block w-full resize-none bg-transparent px-3.5 pt-2.5 pb-2 text-[15px] text-brand-900 outline-none placeholder:text-brand-700/40 dark:text-brand-50 dark:placeholder:text-brand-200/40"
      />

      <div className="flex items-center justify-between gap-2 px-1 pt-1">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-brand-800/80 transition hover:bg-brand-100 dark:text-brand-200 dark:hover:bg-white/5"
          >
            <Paperclip className="h-4 w-4" />
            <span className="hidden sm:inline">Joindre</span>
          </button>

          <button
            type="button"
            onClick={() => setDeepResearch((v) => !v)}
            aria-pressed={deepResearch}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition ${
              deepResearch
                ? 'bg-brand-100 text-brand-800 ring-1 ring-brand-300 dark:bg-brand-600/20 dark:text-brand-200 dark:ring-brand-500/30'
                : 'text-brand-800/80 hover:bg-brand-100 dark:text-brand-200 dark:hover:bg-white/5'
            }`}
          >
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Analyse approfondie</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-full text-brand-700/70 transition hover:bg-brand-100 dark:text-brand-200/70 dark:hover:bg-white/5"
            aria-label="Dictée vocale"
          >
            <Mic className="h-[18px] w-[18px]" />
          </button>

          {isStreaming ? (
            <button
              type="button"
              onClick={onStop}
              aria-label="Arrêter la génération"
              className="grid h-9 w-9 place-items-center rounded-full bg-brand-900 text-brand-50 transition hover:bg-brand-700 dark:bg-brand-100 dark:text-brand-900"
            >
              <Square className="h-4 w-4 fill-current" />
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={!canSend}
              aria-label="Envoyer"
              className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-brand-700 to-brand-500 text-brand-50 shadow-sm shadow-brand-900/30 transition enabled:hover:opacity-90 disabled:cursor-not-allowed disabled:from-brand-200 disabled:to-brand-200 disabled:text-brand-400 disabled:shadow-none dark:disabled:from-white/10 dark:disabled:to-white/10 dark:disabled:text-brand-200/50"
            >
              <ArrowUp className="h-[18px] w-[18px]" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
