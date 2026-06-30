import { useEffect, useRef, useState } from 'react'
import { Paperclip, Globe, Mic, ArrowUp, Square, X } from 'lucide-react'

export default function ChatInput({
  onSend,
  isStreaming = false,
  onStop,
  autoFocus = false,
  placeholder = 'Posez votre question financière…',
}) {
  const [value, setValue] = useState('')
  const [deepResearch, setDeepResearch] = useState(false)
  const [files, setFiles] = useState([])
  const [listening, setListening] = useState(false)
  const [micSupported, setMicSupported] = useState(true)

  const textareaRef = useRef(null)
  const fileInputRef = useRef(null)
  const recognitionRef = useRef(null)
  const micBaseTextRef = useRef('')

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

  // Détection du support de la dictée vocale
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    setMicSupported(!!SR)
    return () => recognitionRef.current?.stop()
  }, [])

  const canSend = value.trim().length > 0 && !isStreaming

  function submit() {
    if (!canSend) return
    recognitionRef.current?.stop()
    onSend(value.trim(), { deepResearch, files })
    setValue('')
    setFiles([])
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  // --- Joindre : sélecteur de fichiers ---
  function openFilePicker() {
    fileInputRef.current?.click()
  }
  function onFilesPicked(e) {
    const picked = Array.from(e.target.files || [])
    if (picked.length) setFiles((prev) => [...prev, ...picked])
    e.target.value = '' // permet de re-sélectionner le même fichier
  }
  function removeFile(index) {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  // --- Micro : dictée vocale (Web Speech API) ---
  function toggleMic() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) {
      setMicSupported(false)
      return
    }
    if (listening) {
      recognitionRef.current?.stop()
      return
    }

    const recognition = new SR()
    recognition.lang = 'fr-FR'
    recognition.continuous = true
    recognition.interimResults = true

    micBaseTextRef.current = value ? value.trimEnd() + ' ' : ''

    recognition.onresult = (event) => {
      let transcript = ''
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript
      }
      setValue(micBaseTextRef.current + transcript)
    }
    recognition.onend = () => setListening(false)
    recognition.onerror = () => setListening(false)

    recognitionRef.current = recognition
    recognition.start()
    setListening(true)
    textareaRef.current?.focus()
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

      {/* Fichiers joints */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 px-1.5 pb-1.5">
          {files.map((file, i) => (
            <span
              key={`${file.name}-${i}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-2.5 py-1 text-xs font-medium text-brand-800 dark:bg-white/10 dark:text-brand-100"
            >
              <Paperclip className="h-3 w-3" />
              <span className="max-w-[160px] truncate">{file.name}</span>
              <button
                type="button"
                onClick={() => removeFile(i)}
                aria-label={`Retirer ${file.name}`}
                className="rounded-full p-0.5 hover:bg-brand-900/10 dark:hover:bg-white/10"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input fichier caché */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        hidden
        onChange={onFilesPicked}
      />

      <div className="flex items-center justify-between gap-2 px-1 pt-1">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={openFilePicker}
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
          {micSupported && (
            <button
              type="button"
              onClick={toggleMic}
              aria-pressed={listening}
              aria-label={listening ? 'Arrêter la dictée' : 'Dictée vocale'}
              className={`grid h-9 w-9 place-items-center rounded-full transition ${
                listening
                  ? 'bg-red-500/15 text-red-600 dark:bg-red-500/20 dark:text-red-400'
                  : 'text-brand-700/70 hover:bg-brand-100 dark:text-brand-200/70 dark:hover:bg-white/5'
              }`}
            >
              <Mic className={`h-[18px] w-[18px] ${listening ? 'animate-pulse' : ''}`} />
            </button>
          )}

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
