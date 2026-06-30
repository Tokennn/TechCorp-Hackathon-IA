import { Moon, Sun } from 'lucide-react'
import Logo from './Logo'

const LINKS = ['Accueil', 'Fonctionnalités', 'Modèle', 'Équipes', 'Contact']

export default function Navbar({ dark, onToggleDark, onReset }) {
  return (
    <header className="sticky top-0 z-30 border-b border-brand-300/40 bg-paper/75 backdrop-blur-xl dark:border-white/10 dark:bg-brand-900/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <button type="button" onClick={onReset} className="shrink-0">
          <Logo size="sm" />
        </button>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((link, i) => (
            <a
              key={link}
              href="#"
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                i === 0
                  ? 'text-brand-700 dark:text-brand-300'
                  : 'text-brand-800/80 hover:bg-brand-100 hover:text-brand-900 dark:text-brand-200/80 dark:hover:bg-white/5 dark:hover:text-white'
              }`}
            >
              {link}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onToggleDark}
            aria-label="Basculer le thème"
            className="grid h-10 w-10 place-items-center rounded-full border border-brand-300/50 text-brand-700 transition hover:bg-brand-100 dark:border-white/10 dark:text-brand-200 dark:hover:bg-white/5"
          >
            {dark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
          </button>

          <button
            type="button"
            className="hidden rounded-full px-4 py-2 text-sm font-semibold text-brand-800 transition hover:bg-brand-100 sm:block dark:text-brand-100 dark:hover:bg-white/5"
          >
            Connexion
          </button>

          <button
            type="button"
            className="rounded-full bg-gradient-to-br from-brand-700 to-brand-500 px-4 py-2 text-sm font-semibold text-brand-50 shadow-sm shadow-brand-900/20 transition hover:opacity-90"
          >
            Démarrer
          </button>
        </div>
      </div>
    </header>
  )
}
