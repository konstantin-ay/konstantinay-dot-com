import { useCallback, useEffect, useState } from 'react'

export type ThemeMode = 'system' | 'light' | 'dark'
export type ResolvedTheme = 'light' | 'dark'

const STORAGE_KEY = 'theme'

function readStoredMode(): ThemeMode {
  if (typeof window === 'undefined') return 'system'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return stored === 'light' || stored === 'dark' ? stored : 'system'
}

function systemPrefersDark(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function applyTheme(resolved: ResolvedTheme): void {
  if (typeof document === 'undefined') return
  document.documentElement.dataset.theme = resolved
}

export function useTheme() {
  const [mode, setModeState] = useState<ThemeMode>('system')
  const [resolved, setResolved] = useState<ResolvedTheme>('light')

  useEffect(() => {
    const m = readStoredMode()
    setModeState(m)
    const r: ResolvedTheme = m === 'system' ? (systemPrefersDark() ? 'dark' : 'light') : m
    setResolved(r)
    applyTheme(r)
  }, [])

  useEffect(() => {
    if (mode !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (e: MediaQueryListEvent) => {
      const r: ResolvedTheme = e.matches ? 'dark' : 'light'
      setResolved(r)
      applyTheme(r)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [mode])

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next)
    if (next === 'system') {
      window.localStorage.removeItem(STORAGE_KEY)
      const r: ResolvedTheme = systemPrefersDark() ? 'dark' : 'light'
      setResolved(r)
      applyTheme(r)
    } else {
      window.localStorage.setItem(STORAGE_KEY, next)
      setResolved(next)
      applyTheme(next)
    }
  }, [])

  const cycle = useCallback(() => {
    setMode(mode === 'system' ? 'light' : mode === 'light' ? 'dark' : 'system')
  }, [mode, setMode])

  return { mode, resolved, setMode, cycle }
}

export const NO_FLASH_THEME_SCRIPT = `(function(){try{var s=localStorage.getItem('theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;var t=(s==='light'||s==='dark')?s:(d?'dark':'light');document.documentElement.dataset.theme=t;}catch(e){}})();`
