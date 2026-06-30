// Mini-rendu Markdown : gère **gras**, listes à puces et listes numérotées,
// et les retours à la ligne. Suffisant pour l'affichage des réponses du modèle.

function renderInline(text, keyPrefix) {
  // Découpe sur les segments en **gras**
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={`${keyPrefix}-b-${i}`} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      )
    }
    return part
  })
}

export default function FormattedText({ text }) {
  const lines = text.split('\n')

  return (
    <div className="space-y-1.5 leading-relaxed">
      {lines.map((line, i) => {
        const trimmed = line.trim()
        if (trimmed === '') return <div key={i} className="h-1.5" />

        const bullet = trimmed.match(/^[-•]\s+(.*)$/)
        if (bullet) {
          return (
            <div key={i} className="flex gap-2 pl-1">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-50" />
              <span>{renderInline(bullet[1], i)}</span>
            </div>
          )
        }

        const numbered = trimmed.match(/^(\d+)\.\s+(.*)$/)
        if (numbered) {
          return (
            <div key={i} className="flex gap-2 pl-1">
              <span className="font-semibold text-brand-700 dark:text-brand-400">
                {numbered[1]}.
              </span>
              <span>{renderInline(numbered[2], i)}</span>
            </div>
          )
        }

        return <p key={i}>{renderInline(line, i)}</p>
      })}
    </div>
  )
}
