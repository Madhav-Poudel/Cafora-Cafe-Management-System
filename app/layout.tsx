import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'ServePilot — Restaurant operations, simplified',
    template: '%s | ServePilot',
  },
  description:
    'A calm, connected workspace for restaurant orders, kitchen operations, inventory, teams, and financial reporting.',
  applicationName: 'ServePilot',
  generator: 'v0.app',
  keywords: [
    'restaurant management',
    'restaurant POS',
    'Nepal restaurant software',
    'inventory management',
    'kitchen display system',
  ],
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'ServePilot — Restaurant operations, simplified',
    description:
      'Manage service, stock, people, and performance from one thoughtful restaurant workspace.',
    siteName: 'ServePilot',
    type: 'website',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#173B3F',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
