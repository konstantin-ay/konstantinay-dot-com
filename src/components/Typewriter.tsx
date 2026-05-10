import { useEffect, useRef, useState } from 'react'

interface TypewriterProps {
  prefix: string
  attempts: readonly string[]
  final: string
  typeMs?: number
  eraseMs?: number
  pauseAfterTypeMs?: number
  pauseAfterEraseMs?: number
  shuffle?: boolean
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
}: TypewriterProps) {
  const fullPhrase = prefix + final
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
      setSuffix(final)
      return () => {
        cancelled.current = true
      }
    }

    const sequence = shuffle ? shuffled(attempts) : [...attempts]
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
  }, [reduced, attempts, final, typeMs, eraseMs, pauseAfterTypeMs, pauseAfterEraseMs, shuffle])

  return (
    <span className='inline'>
      <span aria-hidden='true' className='inline'>
        {prefix}
        <span className='inline'>{suffix}</span>
        <span
          className='inline-block w-[0.06em] h-[0.95em] translate-y-[0.12em] bg-[var(--color-muted)] ml-[0.06em] align-baseline caret-blink'
        />
      </span>
      <span className='sr-only'>{fullPhrase}</span>
    </span>
  )
}
