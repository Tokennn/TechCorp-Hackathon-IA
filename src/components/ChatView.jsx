import { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble'
import ChatInput from './ChatInput'

export default function ChatView({ messages, isStreaming, onSend, onStop }) {
  const bottomRef = useRef(null)

  // Auto-scroll vers le dernier message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="mx-auto flex h-full w-full max-w-3xl flex-col px-4 sm:px-5">
      <div className="scrollbar-slim flex-1 space-y-5 overflow-y-auto py-8">
        {messages.map((m) => (
          <MessageBubble
            key={m.id}
            role={m.role}
            content={m.content}
            pending={m.pending}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="pb-5">
        <ChatInput
          onSend={onSend}
          isStreaming={isStreaming}
          onStop={onStop}
          autoFocus
        />
        <p className="mt-2.5 text-center text-xs text-brand-700/50 dark:text-brand-200/50">
          Phi-3.5-Financial peut produire des erreurs. Vérifiez les informations
          importantes.
        </p>
      </div>
    </div>
  )
}
