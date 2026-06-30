import { Sparkles } from 'lucide-react'
import ChatInput from './ChatInput'
import SuggestionPills from './SuggestionPills'
import GridDistortion from './GridDistortion'
import AnimatedContent from './AnimatedContent'
import TextPressure from './TextPressure'

// Image de fond pour l'effet de distorsion. Remplaçable par un visuel local
// déposé dans /public (ex : "/hero-bg.jpg") pour fonctionner hors-ligne.
const BG_IMAGE = 'https://picsum.photos/1920/1080?grayscale'

export default function Hero({ onSend }) {
  return (
    <section className="relative isolate h-full overflow-hidden">
      {/* Fond interactif distordu (suit le curseur) */}
      <div className="absolute inset-0 -z-10">
        <GridDistortion
          imageSrc={BG_IMAGE}
          grid={12}
          mouse={0.12}
          strength={0.18}
          relaxation={0.9}
          className="h-full w-full"
        />
        {/* Teinte olive + voile pour la lisibilité (clair → crème, sombre → olive foncé) */}
        <div className="absolute inset-0 bg-brand-700/35 mix-blend-multiply dark:bg-brand-900/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-paper/45 via-paper/60 to-paper dark:from-brand-900/50 dark:via-brand-900/75 dark:to-brand-900" />
      </div>

      <div className="mx-auto flex h-full w-full max-w-3xl flex-col items-center justify-center px-5 py-16">
        <AnimatedContent distance={40} duration={0.8} ease="power3.out" delay={0}>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-300/60 bg-surface/80 py-1.5 pr-4 pl-1.5 text-sm shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-700 px-2.5 py-0.5 text-xs font-semibold text-brand-50">
              <Sparkles className="h-3 w-3" />
              Nouveau
            </span>
            <span className="font-medium text-brand-800 dark:text-brand-200">
              Challenge IA TechCorp — Phi-3.5-Financial
            </span>
          </div>
        </AnimatedContent>

        <AnimatedContent distance={50} duration={0.9} ease="power3.out" delay={0.1}>
          <h1 className="text-center font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-brand-900 sm:text-5xl md:text-6xl dark:text-brand-50">
            Décidez plus vite avec
          </h1>
          <div className="relative mx-auto mt-1 h-[80px] w-[180px] sm:h-[104px] sm:w-[230px]">
            <TextPressure
              text="Yves"
              flex
              weight
              width
              italic
              minFontSize={44}
              textColor="var(--yves)"
            />
          </div>
        </AnimatedContent>

        <AnimatedContent distance={40} duration={0.8} ease="power3.out" delay={0.2}>
          <p className="mt-4 max-w-xl text-center text-base text-brand-800/70 sm:text-lg dark:text-brand-200/80">
            Analysez, prévoyez et sécurisez vos décisions financières grâce à un
            modèle d'IA déployé en interne. Posez votre question pour commencer.
          </p>
        </AnimatedContent>

        <AnimatedContent
          className="mt-7 w-full"
          distance={40}
          duration={0.8}
          ease="power3.out"
          delay={0.3}
        >
          <ChatInput
            onSend={onSend}
            autoFocus
            placeholder="Posez-moi n'importe quelle question financière…"
          />
        </AnimatedContent>

        <AnimatedContent
          className="mt-7"
          distance={30}
          duration={0.8}
          ease="power3.out"
          delay={0.4}
        >
          <SuggestionPills onSelect={(s) => onSend(s)} />
        </AnimatedContent>
      </div>
    </section>
  )
}
