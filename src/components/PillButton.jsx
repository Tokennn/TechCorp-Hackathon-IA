import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

// Bouton "pill" reprenant l'animation de PillNav (React Bits) :
// au survol, un cercle (couleur --pill-fill) se déploie depuis le bas et
// remplit la pastille, tandis que le libellé glisse vers le haut et qu'une
// copie de couleur --pill-fg-hover prend sa place.
export default function PillButton({
  icon: Icon,
  label,
  onClick,
  active = false,
  ariaPressed,
  ariaLabel,
  ease = 'power3.out',
}) {
  const pillRef = useRef(null)
  const circleRef = useRef(null)
  const labelRef = useRef(null)
  const hoverLabelRef = useRef(null)
  const tlRef = useRef(null)
  const tweenRef = useRef(null)

  useEffect(() => {
    const pill = pillRef.current
    const circle = circleRef.current
    if (!pill || !circle) return

    const layout = () => {
      const { width: w, height: h } = pill.getBoundingClientRect()
      if (!w || !h) return

      const R = ((w * w) / 4 + h * h) / (2 * h)
      const D = Math.ceil(2 * R) + 2
      const delta =
        Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1
      const originY = D - delta

      circle.style.width = `${D}px`
      circle.style.height = `${D}px`
      circle.style.bottom = `-${delta}px`
      gsap.set(circle, {
        xPercent: -50,
        scale: 0,
        transformOrigin: `50% ${originY}px`,
      })

      const label = labelRef.current
      const hover = hoverLabelRef.current
      if (label) gsap.set(label, { y: 0 })
      if (hover) gsap.set(hover, { y: h + 12, opacity: 0 })

      tlRef.current?.kill()
      const tl = gsap.timeline({ paused: true })
      tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: 'auto' }, 0)
      if (label) tl.to(label, { y: -(h + 8), duration: 2, ease, overwrite: 'auto' }, 0)
      if (hover) {
        gsap.set(hover, { y: Math.ceil(h + 100), opacity: 0 })
        tl.to(hover, { y: 0, opacity: 1, duration: 2, ease, overwrite: 'auto' }, 0)
      }
      tlRef.current = tl
    }

    layout()
    window.addEventListener('resize', layout)
    if (document.fonts) document.fonts.ready.then(layout).catch(() => {})
    return () => window.removeEventListener('resize', layout)
  }, [ease, label])

  const enter = () => {
    const tl = tlRef.current
    if (!tl) return
    tweenRef.current?.kill()
    tweenRef.current = tl.tweenTo(tl.duration(), { duration: 0.3, ease, overwrite: 'auto' })
  }
  const leave = () => {
    const tl = tlRef.current
    if (!tl) return
    tweenRef.current?.kill()
    tweenRef.current = tl.tweenTo(0, { duration: 0.2, ease, overwrite: 'auto' })
  }

  const content = (
    <span className="inline-flex items-center gap-1.5 leading-[1]">
      {Icon && <Icon className="h-[15px] w-[15px]" />}
      {label && <span className="hidden sm:inline">{label}</span>}
    </span>
  )

  return (
    <button
      ref={pillRef}
      type="button"
      onClick={onClick}
      onMouseEnter={enter}
      onMouseLeave={leave}
      aria-pressed={ariaPressed}
      aria-label={ariaLabel}
      className="relative inline-flex h-10 cursor-pointer items-center justify-center overflow-hidden rounded-full px-[18px] text-[13px] font-semibold uppercase tracking-[0.5px] whitespace-nowrap"
      style={{
        background: active ? 'var(--pill-base)' : 'var(--pill-bg)',
        color: active ? 'var(--pill-hover)' : 'var(--pill-text)',
      }}
    >
      <span
        ref={circleRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 bottom-0 z-[1] block rounded-full"
        style={{ background: 'var(--pill-base)', willChange: 'transform' }}
      />
      <span className="relative z-[2] inline-block leading-[1]">
        <span ref={labelRef} className="relative z-[2] inline-block leading-[1]" style={{ willChange: 'transform' }}>
          {content}
        </span>
        <span
          ref={hoverLabelRef}
          aria-hidden="true"
          className="absolute left-0 top-0 z-[3] inline-block"
          style={{ color: 'var(--pill-hover)', willChange: 'transform, opacity' }}
        >
          {content}
        </span>
      </span>
    </button>
  )
}
