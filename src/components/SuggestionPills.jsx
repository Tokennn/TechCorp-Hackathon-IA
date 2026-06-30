const SUGGESTIONS = [
  'Analyser un bilan financier',
  'Prévision de trésorerie',
  'Évaluer un risque de crédit',
  'Calcul de rentabilité (ROI)',
]

export default function SuggestionPills({ onSelect }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5">
      {SUGGESTIONS.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onSelect(s)}
          className="rounded-full border border-brand-300/50 bg-surface/70 px-4 py-2 text-sm font-medium text-brand-800 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-brand-400 hover:text-brand-900 dark:border-white/10 dark:bg-white/5 dark:text-brand-200 dark:hover:border-brand-500/40 dark:hover:text-brand-100"
        >
          {s}
        </button>
      ))}
    </div>
  )
}

export { SUGGESTIONS }
