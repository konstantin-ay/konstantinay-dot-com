import { Monitor, Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { type ThemeMode, useTheme } from '../hooks/useTheme'

const LABELS: Record<ThemeMode, string> = {
  system: 'System theme (next: light)',
  light: 'Light theme (next: dark)',
  dark: 'Dark theme (next: system)',
}

export function ThemeToggle() {
  const { mode, cycle } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Keep server-rendered output stable: render a neutral icon shell on first paint,
  // and swap to the live state once mounted (avoids hydration mismatch).
  const display: ThemeMode = mounted ? mode : 'system'

  return (
    <button
      type='button'
      onClick={cycle}
      aria-label={LABELS[display]}
      title={LABELS[display]}
      className='inline-flex h-9 w-9 items-center justify-center rounded-full border border-rule bg-bg/60 text-fg backdrop-blur transition-colors duration-200 hover:bg-rule/40 focus-visible:outline-2 focus-visible:outline-focus'
    >
      {display === 'system' && <Monitor className='h-4 w-4' aria-hidden='true' />}
      {display === 'light' && <Sun className='h-4 w-4' aria-hidden='true' />}
      {display === 'dark' && <Moon className='h-4 w-4' aria-hidden='true' />}
    </button>
  )
}
