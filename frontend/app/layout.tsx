import React from "react"
import type { Metadata } from 'next'
import './globals.css'
import AlertNotifications from '@/components/AlertNotifications'

export const metadata: Metadata = {
  title: 'Cosmic Watch - NEO Monitoring Dashboard',
  description: 'Real-time asteroid tracking and Near-Earth Object monitoring with advanced risk assessment',
  metadataBase: new URL('https://example.com'),
  icons: {
    icon: '/images/logo.png',
    apple: '/images/logo.png',
  },
  openGraph: {
    title: 'Cosmic Watch - NEO Monitoring Dashboard',
    description: 'Real-time asteroid tracking and Near-Earth Object monitoring with advanced risk assessment',
    images: [{ url: '/images/logo.png', width: 512, height: 512, alt: 'AstroTrack logo' }],
  },
  twitter: {
    card: 'summary',
    title: 'Cosmic Watch - NEO Monitoring Dashboard',
    description: 'Real-time asteroid tracking and Near-Earth Object monitoring with advanced risk assessment',
    images: ['/images/logo.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head><script dangerouslySetInnerHTML={{ __html: "if(localStorage.getItem('cosmic-watch-theme')==='light')document.documentElement.classList.remove('dark')" }} /></head>
      <body className="font-sans antialiased text-foreground">
        {children}
        <AlertNotifications />
      </body>
    </html>
  )
}
