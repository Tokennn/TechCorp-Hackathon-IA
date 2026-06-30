import { Moon, Sun, User } from 'lucide-react'
import { Show, SignInButton, UserButton } from '@clerk/react'

export default function Navbar({ dark, onToggleDark }) {
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-30">
      <div className="relative mx-auto flex h-16 max-w-7xl items-center px-5 sm:px-8">
        {/* Contrôles centrés et flottants : thème + connexion (pas de barre) */}
        <div className="pointer-events-auto absolute left-1/2 flex -translate-x-1/2 items-center gap-2.5">
          <button
            type="button"
            onClick={onToggleDark}
            aria-label="Basculer le thème"
            className="grid h-10 w-10 place-items-center rounded-full border border-brand-300/60 bg-paper/70 text-brand-700 backdrop-blur transition hover:bg-brand-100 dark:border-white/10 dark:bg-brand-900/50 dark:text-brand-200 dark:hover:bg-white/5"
          >
            {dark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
          </button>

          <Show when="signed-out">
            <SignInButton mode="modal">
              <button
                type="button"
                aria-label="Se connecter"
                className="grid h-10 w-10 place-items-center rounded-full border border-brand-300/60 bg-paper/70 text-brand-700 backdrop-blur transition hover:bg-brand-100 dark:border-white/10 dark:bg-brand-900/50 dark:text-brand-200 dark:hover:bg-white/5"
              >
                <User className="h-[18px] w-[18px]" />
              </button>
            </SignInButton>
          </Show>

          <Show when="signed-in">
            <UserButton
              afterSignOutUrl="/"
              appearance={{ elements: { avatarBox: 'h-9 w-9' } }}
            />
          </Show>
        </div>
      </div>
    </header>
  )
}
