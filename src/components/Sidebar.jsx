import { Plus, MessageSquare, Trash2, Loader2 } from 'lucide-react'

export default function Sidebar({
  conversations,
  currentId,
  loading,
  onSelect,
  onNew,
  onDelete,
}) {
  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-brand-300/40 bg-paper/60 backdrop-blur-xl dark:border-white/10 dark:bg-brand-900/50">
      <div className="p-3 pt-20">
        <button
          type="button"
          onClick={onNew}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-brand-700 to-brand-500 px-4 py-2.5 text-sm font-semibold text-brand-50 shadow-sm shadow-brand-900/20 transition hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Nouvelle conversation
        </button>
      </div>

      <div className="scrollbar-slim flex-1 overflow-y-auto px-2 pb-3">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-8 text-sm text-brand-700/60 dark:text-brand-200/60">
            <Loader2 className="h-4 w-4 animate-spin" />
            Chargement…
          </div>
        ) : conversations.length === 0 ? (
          <p className="px-3 py-8 text-center text-sm text-brand-700/50 dark:text-brand-200/50">
            Aucune conversation pour l'instant.
          </p>
        ) : (
          <ul className="space-y-0.5">
            {conversations.map((c) => {
              const active = c.id === currentId
              return (
                <li key={c.id}>
                  <div
                    className={`group flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition ${
                      active
                        ? 'bg-brand-200/60 text-brand-900 dark:bg-white/10 dark:text-brand-50'
                        : 'text-brand-800/80 hover:bg-brand-100 dark:text-brand-200/80 dark:hover:bg-white/5'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => onSelect(c.id)}
                      className="flex min-w-0 flex-1 items-center gap-2 text-left"
                    >
                      <MessageSquare className="h-4 w-4 shrink-0 opacity-60" />
                      <span className="truncate">{c.title || 'Sans titre'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(c.id)}
                      aria-label="Supprimer la conversation"
                      className="shrink-0 rounded-md p-1 text-brand-700/50 opacity-0 transition hover:bg-brand-900/10 hover:text-red-600 group-hover:opacity-100 dark:text-brand-200/50 dark:hover:bg-white/10 dark:hover:text-red-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </aside>
  )
}
