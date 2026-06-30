// Logo TechCorp — wordmark olive façon "Hackathon IA".
// Pour utiliser le fichier image officiel à la place : déposez-le dans
// /public/logo-techcorp.png et remplacez le bloc <span> par une <img>.
export default function Logo({ className = '', subtitle = true, size = 'md' }) {
  const sizes = {
    sm: 'text-xl',
    md: 'text-[26px]',
    lg: 'text-4xl',
  }
  return (
    <div className={`flex flex-col items-start leading-none ${className}`}>
      <span
        className={`font-display font-extrabold tracking-tight text-brand-900 dark:text-brand-100 ${sizes[size]}`}
      >
        TechCorp
      </span>
      {subtitle && (
        <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.38em] text-brand-700/80 dark:text-brand-300/70">
          Hackathon&nbsp;IA
        </span>
      )}
    </div>
  )
}
