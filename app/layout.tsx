import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Cafora — Restaurant operations, simplified',
    template: '%s | Cafora',
  },
  description:
    'A calm, connected workspace for restaurant orders, kitchen operations, inventory, teams, and financial reporting.',
  applicationName: 'Cafora',
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
    title: 'Cafora — Restaurant operations, simplified',
    description:
      'Manage service, stock, people, and performance from one thoughtful restaurant workspace.',
    siteName: 'Cafora',
    type: 'website',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#DC143C',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} ${poppins.className} antialiased`} suppressHydrationWarning>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
