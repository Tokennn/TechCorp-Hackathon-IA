import { User } from 'lucide-react'
import Logo from './Logo'
import FormattedText from './FormattedText'

function AssistantAvatar() {
  return (
    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-brand-700 to-brand-500 shadow-sm">
      <svg width="18" height="18" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <path
          d="M13 13.5C13 12.6716 13.6716 12 14.5 12H25.5C26.3284 12 27 12.6716 27 13.5C27 14.3284 26.3284 15 25.5 15H21.5V27.5C21.5 28.3284 20.8284 29 20 29C19.1716 29 18.5 28.3284 18.5 27.5V15H14.5C13.6716 15 13 14.3284 13 13.5Z"
          fill="white"
        />
      </svg>
    </span>
  )
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 py-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="typing-dot h-2 w-2 rounded-full bg-brand-500 dark:bg-brand-400"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  )
}

export default function MessageBubble({ role, content, pending }) {
  const isUser = role === 'user'

  if (isUser) {
    return (
      <div className="flex animate-fade-in-up justify-end gap-3">
        <div className="max-w-[80%] rounded-2xl rounded-tr-md bg-gradient-to-br from-brand-700 to-brand-500 px-4 py-2.5 text-[15px] text-brand-50 shadow-sm shadow-brand-900/20">
          <p className="whitespace-pre-wrap leading-relaxed">{content}</p>
        </div>
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-200 text-brand-800 dark:bg-white/10 dark:text-brand-200">
          <User className="h-[18px] w-[18px]" />
        </span>
      </div>
    )
  }

  return (
    <div className="flex animate-fade-in-up justify-start gap-3">
      <AssistantAvatar />
      <div className="max-w-[80%] rounded-2xl rounded-tl-md border border-brand-300/50 bg-surface px-4 py-3 text-[15px] text-brand-900/90 shadow-sm dark:border-white/10 dark:bg-brand-800/70 dark:text-brand-100">
        {pending && content.length === 0 ? (
          <TypingDots />
        ) : (
          <FormattedText text={content} />
        )}
      </div>
    </div>
  )
}
