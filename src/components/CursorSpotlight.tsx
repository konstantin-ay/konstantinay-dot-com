import { useEffect, useRef } from 'react'

export function CursorSpotlight() {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(hover: none)').matches
    ) {
      return
    }

    let latestX = 0
    let latestY = 0
    let rafId: number | null = null
    let firstMove = true

    const tick = () => {
      el.style.setProperty('--mx', `${latestX}px`)
      el.style.setProperty('--my', `${latestY}px`)
      rafId = null
    }

    const onMove = (e: PointerEvent) => {
      latestX = e.clientX
      latestY = e.clientY
      if (firstMove) {
        el.style.opacity = '1'
        firstMove = false
      }
      if (rafId === null) {
        rafId = requestAnimationFrame(tick)
      }
    }

    const onLeave = () => {
      el.style.opacity = '0'
      firstMove = true
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerleave', onLeave)
    window.addEventListener('blur', onLeave)

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('blur', onLeave)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [])

  return <div id='cursor-spotlight' ref={ref} aria-hidden='true' />
}
