import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import './globals.css'
import AlertNotifications from '@/components/AlertNotifications'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AstroTrack - NEO Monitoring Dashboard',
  description: 'Real-time asteroid tracking and Near-Earth Object monitoring with advanced risk assessment',
  metadataBase: new URL('https://example.com'),
  icons: {
    icon: '/images/logo.png',
    apple: '/images/logo.png',
  },
  openGraph: {
    title: 'AstroTrack - NEO Monitoring Dashboard',
    description: 'Real-time asteroid tracking and Near-Earth Object monitoring with advanced risk assessment',
    images: [{ url: '/images/logo.png', width: 512, height: 512, alt: 'AstroTrack logo' }],
  },
  twitter: {
    card: 'summary',
    title: 'AstroTrack - NEO Monitoring Dashboard',
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
      <body className="font-sans antialiased text-foreground">
        {children}
        <AlertNotifications />
      </body>
    </html>
  )
}
