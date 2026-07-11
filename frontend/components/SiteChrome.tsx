'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import ThemeToggle from './ThemeToggle'

const links = [
  { href: '/dashboard', label: 'Monitor' },
  { href: '/analytics', label: 'Analysis' },
  { href: '/watchlist', label: 'Watchlist' },
  { href: '/community', label: 'Community' },
  { href: '/guide', label: 'Guide' },
  { href: '/about', label: 'About' },
]

export function SiteNav() {
  const pathname = usePathname()
  return <nav className="site-nav"><div className="site-nav__inside">
    <Link href="/" className="brand"><span className="brand-logo-shell"><Image className="brand-logo" src="/images/logo.png" alt="Cosmic Watch" width={34} height={34} priority/></span><span>COSMIC WATCH</span></Link>
    <div className="nav-links">{links.map(link => <Link key={link.href} href={link.href} aria-current={pathname === link.href ? 'page' : undefined}>{link.label}</Link>)}</div>
    <div className="nav-actions"><ThemeToggle/><Link className="button-dark" href="/dashboard">Open monitor</Link></div>
  </div></nav>
}

export function SiteFooter() {
  return <><div className="sunset-stripe"/><footer className="site-footer"><div className="site-footer__inside">
    <div><div className="brand"><span className="brand-logo-shell"><Image className="brand-logo" src="/images/logo.png" alt="Cosmic Watch" width={30} height={30}/></span><span>COSMIC WATCH</span></div><p>Near-Earth object intelligence, made clear.</p></div>
    <div className="footer-links"><Link href="/dashboard">Monitor</Link><Link href="/analytics">Analysis</Link><Link href="/watchlist">Watchlist</Link><Link href="/guide">Guide</Link><Link href="/about">About</Link></div>
  </div></footer></>
}

export function AppPage({ children }: { children: ReactNode }) { return <div className="editorial-page"><SiteNav/>{children}<SiteFooter/></div> }
