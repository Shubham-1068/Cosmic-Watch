'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useState, ReactNode, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { storageHelpers } from '@/lib/api'

export interface NavLink {
    href: string
    label: string
}

export interface FloatingNavbarProps {
    logoHref?: string
    logoText?: string
    logoAbbr?: string
    navLinks?: NavLink[]
    onLogout?: () => void | Promise<void>
    position?: 'top' | 'bottom'
    showLogout?: boolean
    children?: ReactNode
}

export default function FloatingNavbar({
    logoHref = '/dashboard',
    logoText = 'Cosmic Watch',
    logoAbbr = 'CW',
    navLinks = [
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/analytics', label: 'Analytics' },
        { href: '/watchlist', label: 'Watchlist' },
        { href: '/community', label: 'Community' },
    ],
    onLogout,
    position = 'top',
    showLogout = true,
    children,
}: FloatingNavbarProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoggingOut, setIsLoggingOut] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        setIsAuthenticated(storageHelpers.isAuthenticated())
    }, [])

    const handleLogout = async () => {
        setIsLoggingOut(true)
        try {
            if (onLogout) {
                await onLogout()
            } else {
                storageHelpers.clearAuth()
                window.location.href = '/login'
            }
        } finally {
            setIsLoggingOut(false)
        }
    }

    const positionClasses =
        position === 'bottom'
            ? 'fixed bottom-4 left-0 right-0'
            : 'fixed top-4 left-0 right-0'

    return (
        <nav className={`${positionClasses} z-50 px-4 sm:px-6`}>
            <div className="mx-auto max-w-4xl">
                <div className="rounded-2xl border border-border bg-slate-800/50 sm:rounded-2xl sm:border-border/50">
                    {/* Main navbar content */}
                    <div className="flex items-center justify-between px-4 py-3 sm:px-6">
                        {/* Logo */}
                        <Link
                            href={logoHref}
                            className="flex items-center gap-2 flex-shrink-0"
                        >
                            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                                <img src="/images/logo.png" alt="Logo" className="w-full h-full object-contain" />
                            </div>
                            <span className="hidden sm:block font-bold text-sm sm:text-base text-foreground">
                                {logoText}
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="px-3 py-2 text-sm font-medium text-white rounded-md"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {/* Desktop Actions */}
                        <div className="hidden md:flex items-center gap-2">
                            {children}
                            {showLogout && (
                                isAuthenticated ? (
                                    <Button
                                        onClick={handleLogout}
                                        disabled={isLoggingOut}
                                        variant="ghost"
                                        size="sm"
                                        className="text-white hover:bg-transparent hover:text-white"
                                    >
                                        {isLoggingOut ? 'Logging out...' : 'Logout'}
                                    </Button>
                                ) : (
                                    <Link href="/login">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-white"
                                        >
                                            Login
                                        </Button>
                                    </Link>
                                )
                            )}
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden p-2 rounded-md text-foreground"
                            aria-label={isOpen ? 'Close menu' : 'Open menu'}
                            aria-expanded={isOpen}
                        >
                            {isOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </button>
                    </div>

                    {/* Mobile Menu Dropdown */}
                    {isOpen && (
                        <div className="md:hidden border-t border-border/50 bg-slate-900/90 rounded-b-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="px-4 py-3 space-y-2 text-center">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="block px-3 py-2 text-md font-medium  rounded-md"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                {(children || showLogout) && (
                                    <div className="pt-2 border-t border-border/30 flex flex-col items-center gap-2 fl">
                                        {children}
                                        {showLogout && (
                                            isAuthenticated ? (
                                                <Button
                                                    onClick={() => {
                                                        handleLogout()
                                                        setIsOpen(false)
                                                    }}
                                                    disabled={isLoggingOut}
                                                    variant="ghost"
                                                    className="w-full justify-center text-destructive border border-destructive/30 bg-destructive/15"
                                                >
                                                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                                                </Button>
                                            ) : (
                                                <Link href="/login" onClick={() => setIsOpen(false)} className="w-full">
                                                    <Button
                                                        variant="ghost"
                                                        className="w-full justify-center text-primary border border-primary/30 bg-primary/15"
                                                    >
                                                        Login
                                                    </Button>
                                                </Link>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}
