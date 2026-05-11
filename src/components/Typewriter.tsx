import { type CSSProperties, useEffect, useRef, useState } from 'react'

interface TypewriterProps {
  prefix: string
  attempts: readonly string[]
  final: string
  typeMs?: number
  eraseMs?: number
  pauseAfterTypeMs?: number
  pauseAfterEraseMs?: number
  shuffle?: boolean
  maxAttempts?: number
}

function shuffled<T>(items: readonly T[]): T[] {
  const arr = [...items]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = arr[i] as T
    arr[i] = arr[j] as T
    arr[j] = tmp
  }
  return arr
}

export function Typewriter({
  prefix,
  attempts,
  final,
  typeMs = 80,
  eraseMs = 45,
  pauseAfterTypeMs = 700,
  pauseAfterEraseMs = 220,
  shuffle = true,
  maxAttempts = 3,
}: TypewriterProps) {
  const fullPhrase = prefix + final
  const [typedPrefix, setTypedPrefix] = useState('')
  const [suffix, setSuffix] = useState('')
  const [reduced, setReduced] = useState(false)
  const cancelled = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    cancelled.current = false

    if (reduced) {
      return () => {
        cancelled.current = true
      }
    }

    const sequence = (shuffle ? shuffled(attempts) : [...attempts]).slice(0, maxAttempts)
    sequence.push(final)

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        const id = setTimeout(resolve, ms)
        const cancel = () => {
          clearTimeout(id)
          resolve()
        }
        ;(sleep as unknown as { cancel?: () => void }).cancel = cancel
      })

    let aborted = false

    async function run() {
      // Phase 1 — type the prefix once. This is the intro typing of "I'm "
      // before the misspell-and-retry loop kicks in on the name.
      for (let i = 1; i <= prefix.length; i++) {
        if (cancelled.current) return
        setTypedPrefix(prefix.slice(0, i))
        await sleep(typeMs)
      }

      // Phase 2 — misspell-and-retry loop on the name (suffix only).
      for (let s = 0; s < sequence.length; s++) {
        if (cancelled.current) return
        const word = sequence[s] as string
        const isFinal = s === sequence.length - 1

        for (let i = 1; i <= word.length; i++) {
          if (cancelled.current) return
          setSuffix(word.slice(0, i))
          await sleep(typeMs)
        }

        if (cancelled.current) return
        if (isFinal) break

        await sleep(pauseAfterTypeMs)

        for (let i = word.length - 1; i >= 0; i--) {
          if (cancelled.current) return
          setSuffix(word.slice(0, i))
          await sleep(eraseMs)
        }

        if (cancelled.current) return
        await sleep(pauseAfterEraseMs)
      }
    }

    run()

    return () => {
      aborted = true
      cancelled.current = true
      void aborted
    }
  }, [
    reduced,
    prefix,
    attempts,
    final,
    typeMs,
    eraseMs,
    pauseAfterTypeMs,
    pauseAfterEraseMs,
    shuffle,
    maxAttempts,
  ])

  return (
    <span className='inline'>
      {/* Animated version — hidden under prefers-reduced-motion via CSS, so the
       * static span below takes over without waiting on JS / hydration. */}
      <span aria-hidden='true' className='inline motion-reduce:hidden'>
        {typedPrefix}
        <span className='inline'>{suffix}</span>
        <span className='inline-block w-[0.06em] h-[0.95em] translate-y-[0.12em] bg-[var(--color-muted)] ml-[0.06em] align-baseline caret-blink' />
      </span>
      {/* Static fallback — only visible under prefers-reduced-motion. Not
       * aria-hidden so screen readers pick it up directly when shown. */}
      <span className='hidden motion-reduce:inline'>{fullPhrase}</span>
      {/* SR-only mirror of the truthful phrase for screen readers while the
       * animated span (which mutates through misspellings) is the visible one.
       * Hidden under reduced motion to avoid double-announcing alongside the
       * static span above. Inline visually-hidden styles guard against a flash
       * before the external stylesheet has applied (e.g. Vite dev). */}
      <span className='sr-only motion-reduce:hidden' style={visuallyHidden}>
        {fullPhrase}
      </span>
    </span>
  )
}

const visuallyHidden: CSSProperties = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap',
  borderWidth: 0,
}
