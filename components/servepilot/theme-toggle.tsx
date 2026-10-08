'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

const themeStorageKey = 'cafora-theme'

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const enabled = window.localStorage.getItem(themeStorageKey) === 'dark'
    setDarkMode(enabled)
    document.documentElement.classList.toggle('dark', enabled)
  }, [])

  function toggleTheme() {
    const enabled = !darkMode
    setDarkMode(enabled)
    window.localStorage.setItem(themeStorageKey, enabled ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', enabled)
  }

  return (
    <button
      type="button"
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={darkMode}
      title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={toggleTheme}
      className={`inline-flex items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground ${
        compact ? 'size-9' : 'h-9 gap-2 px-3 text-xs font-medium'
      }`}
    >
      {darkMode ? <Sun aria-hidden="true" className="size-4" /> : <Moon aria-hidden="true" className="size-4" />}
      {!compact && <span>{darkMode ? 'Light' : 'Dark'}</span>}
    </button>
  )
}
