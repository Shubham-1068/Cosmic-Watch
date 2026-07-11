'use client'

import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [dark, setDark] = useState(true)
  useEffect(() => setDark(document.documentElement.classList.contains('dark')), [])
  const toggle = () => {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('cosmic-watch-theme', next ? 'dark' : 'light')
  }
  return <button onClick={toggle} className="theme-toggle" aria-label={dark ? 'Use light theme' : 'Use dark theme'}>{dark ? <Sun size={16}/> : <Moon size={16}/>}<span>{dark ? 'Light' : 'Dark'}</span></button>
}
